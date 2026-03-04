import {
  mockProjects,
  mockUsers,
  mockTasks,
  mockComments,
  mockNotifications,
  mockActivities,
} from './mockData.js';

/**
 * Simulates an async network delay, resolving with the provided data
 * after a random duration between 200ms and 500ms.
 */
function delay(data) {
  const ms = Math.floor(Math.random() * 301) + 200;
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/**
 * Generates a simple unique id string based on timestamp and a random suffix.
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const api = {
  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------

  getProjects() {
    const copy = mockProjects.map((p) => ({ ...p }));
    return delay(copy);
  },

  getProject(id) {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) {
      return delay(null);
    }
    return delay({ ...project });
  },

  createProject(data) {
    const newProject = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    mockProjects.push(newProject);
    return delay({ ...newProject });
  },

  updateProject(id, data) {
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      return delay(null);
    }
    mockProjects[index] = { ...mockProjects[index], ...data, id };
    return delay({ ...mockProjects[index] });
  },

  deleteProject(id) {
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      return delay(false);
    }
    mockProjects.splice(index, 1);
    return delay(true);
  },

  // ---------------------------------------------------------------------------
  // Tasks
  // ---------------------------------------------------------------------------

  getTasks(projectId) {
    let tasks;
    if (projectId) {
      tasks = mockTasks.filter((t) => t.projectId === projectId);
    } else {
      tasks = [...mockTasks];
    }
    return delay(tasks.map((t) => ({ ...t })));
  },

  getTask(id) {
    const task = mockTasks.find((t) => t.id === id);
    if (!task) {
      return delay(null);
    }
    return delay({ ...task });
  },

  createTask(data) {
    const newTask = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    return delay({ ...newTask });
  },

  updateTask(id, data) {
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return delay(null);
    }
    mockTasks[index] = { ...mockTasks[index], ...data, id };
    return delay({ ...mockTasks[index] });
  },

  moveTask(id, status) {
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return delay(null);
    }
    mockTasks[index] = { ...mockTasks[index], status };
    return delay({ ...mockTasks[index] });
  },

  deleteTask(id) {
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return delay(false);
    }
    mockTasks.splice(index, 1);
    return delay(true);
  },

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  getUsers() {
    const copy = mockUsers.map((u) => ({ ...u }));
    return delay(copy);
  },

  getUser(id) {
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      return delay(null);
    }
    return delay({ ...user });
  },

  updateUser(id, data) {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return delay(null);
    }
    mockUsers[index] = { ...mockUsers[index], ...data, id };
    return delay({ ...mockUsers[index] });
  },

  // ---------------------------------------------------------------------------
  // Comments
  // ---------------------------------------------------------------------------

  getComments(taskId) {
    const comments = mockComments.filter((c) => c.taskId === taskId);
    return delay(comments.map((c) => ({ ...c })));
  },

  addComment(data) {
    const newComment = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    mockComments.push(newComment);
    return delay({ ...newComment });
  },

  deleteComment(id) {
    const index = mockComments.findIndex((c) => c.id === id);
    if (index === -1) {
      return delay(false);
    }
    mockComments.splice(index, 1);
    return delay(true);
  },

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------

  getNotifications(userId) {
    const notifications = mockNotifications.filter((n) => n.userId === userId);
    return delay(notifications.map((n) => ({ ...n })));
  },

  markNotificationRead(id) {
    const index = mockNotifications.findIndex((n) => n.id === id);
    if (index === -1) {
      return delay(null);
    }
    mockNotifications[index] = { ...mockNotifications[index], read: true };
    return delay({ ...mockNotifications[index] });
  },

  markAllNotificationsRead(userId) {
    const updated = [];
    for (let i = 0; i < mockNotifications.length; i++) {
      if (mockNotifications[i].userId === userId) {
        mockNotifications[i] = { ...mockNotifications[i], read: true };
        updated.push({ ...mockNotifications[i] });
      }
    }
    return delay(updated);
  },

  // ---------------------------------------------------------------------------
  // Activities
  // ---------------------------------------------------------------------------

  getActivities(limit) {
    const sorted = [...mockActivities].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const sliced = limit ? sorted.slice(0, limit) : sorted;
    return delay(sliced.map((a) => ({ ...a })));
  },
};
