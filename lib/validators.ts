import { Client, Worker, Task, ValidationError } from '@/contexts/data-context';

export function validateData(
  clients: Client[], 
  workers: Worker[], 
  tasks: Task[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate clients
  errors.push(...validateClients(clients, tasks));
  
  // Validate workers
  errors.push(...validateWorkers(workers));
  
  // Validate tasks
  errors.push(...validateTasks(tasks, workers));
  
  // Cross-entity validations
  errors.push(...validateCrossReferences(clients, workers, tasks));

  return errors;
}

function validateClients(clients: Client[], tasks: Task[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const clientIds = new Set<string>();
  const taskIds = new Set(tasks.map(t => t.TaskID));

  clients.forEach((client, index) => {
    // Check for duplicate IDs
    if (clientIds.has(client.ClientID)) {
      errors.push({
        id: `client-duplicate-${index}`,
        type: 'error',
        message: `Duplicate Client ID: ${client.ClientID}`,
        entity: 'clients',
        rowIndex: index,
        field: 'ClientID'
      });
    }
    clientIds.add(client.ClientID);

    // Validate priority level
    if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
      errors.push({
        id: `client-priority-${index}`,
        type: 'error',
        message: `Priority level must be between 1-5, got: ${client.PriorityLevel}`,
        entity: 'clients',
        rowIndex: index,
        field: 'PriorityLevel'
      });
    }

    // Validate requested task IDs
    if (client.RequestedTaskIDs) {
      const requestedTasks = client.RequestedTaskIDs.split(',').map(id => id.trim());
      requestedTasks.forEach(taskId => {
        if (taskId && !taskIds.has(taskId)) {
          errors.push({
            id: `client-unknown-task-${index}-${taskId}`,
            type: 'error',
            message: `Unknown task ID referenced: ${taskId}`,
            entity: 'clients',
            rowIndex: index,
            field: 'RequestedTaskIDs'
          });
        }
      });
    }

    // Validate JSON attributes
    if (client.AttributesJSON) {
      try {
        JSON.parse(client.AttributesJSON);
      } catch {
        errors.push({
          id: `client-json-${index}`,
          type: 'error',
          message: `Invalid JSON in AttributesJSON`,
          entity: 'clients',
          rowIndex: index,
          field: 'AttributesJSON'
        });
      }
    }
  });

  return errors;
}

function validateWorkers(workers: Worker[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const workerIds = new Set<string>();

  workers.forEach((worker, index) => {
    // Check for duplicate IDs
    if (workerIds.has(worker.WorkerID)) {
      errors.push({
        id: `worker-duplicate-${index}`,
        type: 'error',
        message: `Duplicate Worker ID: ${worker.WorkerID}`,
        entity: 'workers',
        rowIndex: index,
        field: 'WorkerID'
      });
    }
    workerIds.add(worker.WorkerID);

    // Validate available slots
    if (worker.AvailableSlots) {
      try {
        const slots = JSON.parse(worker.AvailableSlots);
        if (!Array.isArray(slots) || !slots.every(slot => typeof slot === 'number' && slot > 0)) {
          errors.push({
            id: `worker-slots-${index}`,
            type: 'error',
            message: `AvailableSlots must be array of positive numbers`,
            entity: 'workers',
            rowIndex: index,
            field: 'AvailableSlots'
          });
        }
      } catch {
        errors.push({
          id: `worker-slots-format-${index}`,
          type: 'error',
          message: `Invalid format for AvailableSlots`,
          entity: 'workers',
          rowIndex: index,
          field: 'AvailableSlots'
        });
      }
    }

    // Validate max load per phase
    if (worker.MaxLoadPerPhase < 1) {
      errors.push({
        id: `worker-load-${index}`,
        type: 'error',
        message: `MaxLoadPerPhase must be at least 1`,
        entity: 'workers',
        rowIndex: index,
        field: 'MaxLoadPerPhase'
      });
    }

    // Validate qualification level
    if (worker.QualificationLevel < 1 || worker.QualificationLevel > 10) {
      errors.push({
        id: `worker-qualification-${index}`,
        type: 'warning',
        message: `Unusual qualification level: ${worker.QualificationLevel}`,
        entity: 'workers',
        rowIndex: index,
        field: 'QualificationLevel'
      });
    }
  });

  return errors;
}

function validateTasks(tasks: Task[], workers: Worker[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const taskIds = new Set<string>();
  const workerSkills = new Set<string>();

  // Collect all worker skills
  workers.forEach(worker => {
    if (worker.Skills) {
      worker.Skills.split(',').forEach(skill => {
        workerSkills.add(skill.trim().toLowerCase());
      });
    }
  });

  tasks.forEach((task, index) => {
    // Check for duplicate IDs
    if (taskIds.has(task.TaskID)) {
      errors.push({
        id: `task-duplicate-${index}`,
        type: 'error',
        message: `Duplicate Task ID: ${task.TaskID}`,
        entity: 'tasks',
        rowIndex: index,
        field: 'TaskID'
      });
    }
    taskIds.add(task.TaskID);

    // Validate duration
    if (task.Duration < 1) {
      errors.push({
        id: `task-duration-${index}`,
        type: 'error',
        message: `Duration must be at least 1`,
        entity: 'tasks',
        rowIndex: index,
        field: 'Duration'
      });
    }

    // Validate required skills coverage
    if (task.RequiredSkills) {
      const requiredSkills = task.RequiredSkills.split(',').map(skill => skill.trim().toLowerCase());
      requiredSkills.forEach(skill => {
        if (skill && !workerSkills.has(skill)) {
          errors.push({
            id: `task-skill-coverage-${index}-${skill}`,
            type: 'warning',
            message: `Required skill '${skill}' not available in any worker`,
            entity: 'tasks',
            rowIndex: index,
            field: 'RequiredSkills'
          });
        }
      });
    }

    // Validate max concurrent
    if (task.MaxConcurrent < 1) {
      errors.push({
        id: `task-concurrent-${index}`,
        type: 'error',
        message: `MaxConcurrent must be at least 1`,
        entity: 'tasks',
        rowIndex: index,
        field: 'MaxConcurrent'
      });
    }

    // Validate preferred phases format
    if (task.PreferredPhases) {
      const phases = task.PreferredPhases;
      // Check if it's a range like "1-3" or a list like "[1,2,3]"
      if (!phases.match(/^\d+-\d+$/) && !phases.match(/^\[\d+(,\d+)*\]$/)) {
        errors.push({
          id: `task-phases-format-${index}`,
          type: 'warning',
          message: `PreferredPhases format unclear: ${phases}`,
          entity: 'tasks',
          rowIndex: index,
          field: 'PreferredPhases'
        });
      }
    }
  });

  return errors;
}

function validateCrossReferences(clients: Client[], workers: Worker[], tasks: Task[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if there are any clients, workers, or tasks at all
  if (clients.length === 0) {
    errors.push({
      id: 'missing-clients',
      type: 'error',
      message: 'No client data found',
      entity: 'clients'
    });
  }

  if (workers.length === 0) {
    errors.push({
      id: 'missing-workers',
      type: 'warning',
      message: 'No worker data found - tasks cannot be assigned',
      entity: 'workers'
    });
  }

  if (tasks.length === 0) {
    errors.push({
      id: 'missing-tasks',
      type: 'warning',
      message: 'No task data found',
      entity: 'tasks'
    });
  }

  // Additional cross-reference validations would go here
  // For example, checking if total worker capacity can handle total task load

  return errors;
}