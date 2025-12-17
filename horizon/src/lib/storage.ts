// File System Access API wrapper for Horizon

import matter from 'gray-matter';
import type { Manifest, ManifestIndex } from '../types';

const DIRECTORY_STRUCTURE = ['clients', 'projects', 'daily', 'observations'];

export async function selectDirectory(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const handle = await window.showDirectoryPicker({
      mode: 'readwrite',
    });
    return handle;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      return null;
    }
    throw err;
  }
}

export async function verifyPermission(
  handle: FileSystemDirectoryHandle,
  readWrite = true
): Promise<boolean> {
  const options: FileSystemHandlePermissionDescriptor = {
    mode: readWrite ? 'readwrite' : 'read',
  };

  if ((await handle.queryPermission(options)) === 'granted') {
    return true;
  }

  if ((await handle.requestPermission(options)) === 'granted') {
    return true;
  }

  return false;
}

export async function scaffoldDirectory(
  handle: FileSystemDirectoryHandle
): Promise<void> {
  for (const dir of DIRECTORY_STRUCTURE) {
    try {
      await handle.getDirectoryHandle(dir, { create: true });
    } catch (err) {
      console.error(`Failed to create directory ${dir}:`, err);
    }
  }

  // Create initial manifest if it doesn't exist
  try {
    await handle.getFileHandle('manifest.json');
  } catch {
    const manifest: Manifest = {
      version: '1.0.0',
      lastSync: new Date().toISOString(),
      indices: {
        clients: {},
        projects: {},
        tasks: {},
      },
    };
    await writeJsonFile(handle, 'manifest.json', manifest);
  }
}

export async function readFile(
  handle: FileSystemDirectoryHandle,
  path: string
): Promise<string> {
  const parts = path.split('/');
  let current: FileSystemDirectoryHandle | FileSystemFileHandle = handle;

  for (let i = 0; i < parts.length - 1; i++) {
    current = await (current as FileSystemDirectoryHandle).getDirectoryHandle(parts[i]);
  }

  const fileHandle = await (current as FileSystemDirectoryHandle).getFileHandle(
    parts[parts.length - 1]
  );
  const file = await fileHandle.getFile();
  return await file.text();
}

export async function writeFile(
  handle: FileSystemDirectoryHandle,
  path: string,
  content: string
): Promise<void> {
  const parts = path.split('/');
  let current: FileSystemDirectoryHandle = handle;

  // Navigate/create directories
  for (let i = 0; i < parts.length - 1; i++) {
    current = await current.getDirectoryHandle(parts[i], { create: true });
  }

  // Write file
  const fileHandle = await current.getFileHandle(parts[parts.length - 1], {
    create: true,
  });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

export async function readMarkdownFile<T>(
  handle: FileSystemDirectoryHandle,
  path: string
): Promise<{ frontmatter: T; content: string }> {
  const text = await readFile(handle, path);
  const { data, content } = matter(text);
  return { frontmatter: data as T, content };
}

export async function writeMarkdownFile<T extends Record<string, unknown>>(
  handle: FileSystemDirectoryHandle,
  path: string,
  frontmatter: T,
  content: string
): Promise<void> {
  const text = matter.stringify(content, frontmatter);
  await writeFile(handle, path, text);
}

export async function readJsonFile<T>(
  handle: FileSystemDirectoryHandle,
  path: string
): Promise<T> {
  const text = await readFile(handle, path);
  return JSON.parse(text) as T;
}

export async function writeJsonFile<T>(
  handle: FileSystemDirectoryHandle,
  path: string,
  data: T
): Promise<void> {
  await writeFile(handle, path, JSON.stringify(data, null, 2));
}

export async function listFiles(
  handle: FileSystemDirectoryHandle,
  directory: string
): Promise<string[]> {
  const files: string[] = [];

  try {
    const dirHandle = await handle.getDirectoryHandle(directory);

    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.md')) {
        files.push(`${directory}/${entry.name}`);
      }
    }
  } catch (err) {
    console.error(`Failed to list files in ${directory}:`, err);
  }

  return files;
}

export async function fileExists(
  handle: FileSystemDirectoryHandle,
  path: string
): Promise<boolean> {
  try {
    await readFile(handle, path);
    return true;
  } catch {
    return false;
  }
}

export async function buildManifest(
  handle: FileSystemDirectoryHandle
): Promise<Manifest> {
  const indices: ManifestIndex = {
    clients: {},
    projects: {},
    tasks: {},
  };

  // Index clients
  const clientFiles = await listFiles(handle, 'clients');
  for (const file of clientFiles) {
    try {
      const { frontmatter } = await readMarkdownFile<{ id: string; name: string; status: string }>(
        handle,
        file
      );
      indices.clients[frontmatter.id] = {
        file,
        name: frontmatter.name,
        status: frontmatter.status as 'active' | 'archived',
      };
    } catch (err) {
      console.error(`Failed to index ${file}:`, err);
    }
  }

  // Index projects
  const projectFiles = await listFiles(handle, 'projects');
  for (const file of projectFiles) {
    try {
      const { frontmatter } = await readMarkdownFile<{
        id: string;
        clientId?: string;
        name: string;
        status: string;
      }>(handle, file);
      indices.projects[frontmatter.id] = {
        file,
        clientId: frontmatter.clientId,
        name: frontmatter.name,
        status: frontmatter.status as 'active' | 'paused' | 'completed' | 'archived',
      };
    } catch (err) {
      console.error(`Failed to index ${file}:`, err);
    }
  }

  // Index daily files for tasks
  const dailyFiles = await listFiles(handle, 'daily');
  for (const file of dailyFiles) {
    try {
      const { content } = await readMarkdownFile<{ date: string }>(handle, file);
      // Parse task IDs from content
      const taskMatches = content.matchAll(/- id: (task_\w+)/g);
      for (const match of taskMatches) {
        const projectMatch = content.match(new RegExp(`${match[1]}[\\s\\S]*?projectId: (proj_\\w+)`));
        const statusMatch = content.match(new RegExp(`${match[1]}[\\s\\S]*?status: (\\w+)`));
        indices.tasks[match[1]] = {
          file,
          projectId: projectMatch?.[1],
          status: (statusMatch?.[1] || 'planned') as 'planned' | 'in-progress' | 'completed' | 'overdue',
        };
      }
    } catch (err) {
      console.error(`Failed to index ${file}:`, err);
    }
  }

  const manifest: Manifest = {
    version: '1.0.0',
    lastSync: new Date().toISOString(),
    indices,
  };

  // Save manifest
  await writeJsonFile(handle, 'manifest.json', manifest);

  return manifest;
}
