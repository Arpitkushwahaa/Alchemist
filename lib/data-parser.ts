import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export async function parseCSVData(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // AI-powered header mapping
        return mapColumnHeader(header);
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export async function parseXLSXData(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header mapping
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: ''
        });
        
        if (jsonData.length === 0) {
          reject(new Error('Empty spreadsheet'));
          return;
        }
        
        // Map headers and convert to objects
        const headers = (jsonData[0] as string[]).map(mapColumnHeader);
        const rows = jsonData.slice(1) as any[][];
        
        const objects = rows.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        
        resolve(objects);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

function mapColumnHeader(header: string): string {
  const normalizedHeader = header.toLowerCase().trim();
  
  // Client mappings
  const clientMappings: Record<string, string> = {
    'client_id': 'ClientID',
    'clientid': 'ClientID',
    'id': 'ClientID',
    'client_name': 'ClientName',
    'clientname': 'ClientName',
    'name': 'ClientName',
    'priority': 'PriorityLevel',
    'priority_level': 'PriorityLevel',
    'prioritylevel': 'PriorityLevel',
    'requested_tasks': 'RequestedTaskIDs',
    'requestedtasks': 'RequestedTaskIDs',
    'requested_task_ids': 'RequestedTaskIDs',
    'requestedtaskids': 'RequestedTaskIDs',
    'tasks': 'RequestedTaskIDs',
    'group': 'GroupTag',
    'group_tag': 'GroupTag',
    'grouptag': 'GroupTag',
    'attributes': 'AttributesJSON',
    'attributes_json': 'AttributesJSON',
    'attributesjson': 'AttributesJSON',
    'metadata': 'AttributesJSON'
  };
  
  // Worker mappings
  const workerMappings: Record<string, string> = {
    'worker_id': 'WorkerID',
    'workerid': 'WorkerID',
    'id': 'WorkerID',
    'worker_name': 'WorkerName',
    'workername': 'WorkerName',
    'name': 'WorkerName',
    'skills': 'Skills',
    'skill': 'Skills',
    'available_slots': 'AvailableSlots',
    'availableslots': 'AvailableSlots',
    'slots': 'AvailableSlots',
    'max_load': 'MaxLoadPerPhase',
    'maxload': 'MaxLoadPerPhase',
    'max_load_per_phase': 'MaxLoadPerPhase',
    'maxloadperphase': 'MaxLoadPerPhase',
    'load': 'MaxLoadPerPhase',
    'worker_group': 'WorkerGroup',
    'workergroup': 'WorkerGroup',
    'group': 'WorkerGroup',
    'qualification': 'QualificationLevel',
    'qualification_level': 'QualificationLevel',
    'qualificationlevel': 'QualificationLevel',
    'level': 'QualificationLevel'
  };
  
  // Task mappings
  const taskMappings: Record<string, string> = {
    'task_id': 'TaskID',
    'taskid': 'TaskID',
    'id': 'TaskID',
    'task_name': 'TaskName',
    'taskname': 'TaskName',
    'name': 'TaskName',
    'category': 'Category',
    'type': 'Category',
    'duration': 'Duration',
    'time': 'Duration',
    'required_skills': 'RequiredSkills',
    'requiredskills': 'RequiredSkills',
    'skills': 'RequiredSkills',
    'preferred_phases': 'PreferredPhases',
    'preferredphases': 'PreferredPhases',
    'phases': 'PreferredPhases',
    'max_concurrent': 'MaxConcurrent',
    'maxconcurrent': 'MaxConcurrent',
    'concurrent': 'MaxConcurrent',
    'concurrency': 'MaxConcurrent'
  };
  
  // Combine all mappings
  const allMappings = { ...clientMappings, ...workerMappings, ...taskMappings };
  
  // Return mapped header or original if no mapping found
  return allMappings[normalizedHeader] || header;
}