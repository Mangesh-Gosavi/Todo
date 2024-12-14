import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { appendFile ,readFile ,writeFile } from "fs/promises"; 

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'https://mytodo-mauve.vercel.app' }));
app.use(bodyParser.json());

app.get('/tasks', async (req, res) => {
  try {
    const data = await readFile('tasks.txt', 'utf8');
    const lines = data.split('\n');

    const tasks = lines
      .filter(line => line.trim() !== "")  
      .map((line, index) => {
        const [task, priority, status] = line.split(',');
        return { id: index + 1, task, priority, status }; 
      });

    res.status(200).json(tasks);

  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).send("Error reading tasks file");
  }
});


app.post("/add-task", async (req, res) => {
  const { task, priority } = req.body;

  if (!task || !priority) {
    return res.status(400).send("Task and priority are required");
  }

  try {
    await appendFile("tasks.txt", `${task},${priority},pending\n`);
    res.status(200).send("Task saved");
  } catch (error) {
    console.error("Error writing to file:", error);
    res.status(500).send("Failed to save task");
  }
});

app.post('/delete-tasks', async (req, res) => {
  const { tasks } = req.body; 

  try {
    const updatedTasksText = tasks
      .map(task => `${task.task},${task.priority},${task.status}`)
      .join('\n'); 

    await writeFile('tasks.txt', updatedTasksText, 'utf8');

    res.status(200).send("Tasks updated successfully!");
  } catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).send("Error updating tasks");
  }
});

app.post('/edit-task', async (req, res) => {
  const { id, task } = req.body; 

  try {
    const data = await readFile('tasks.txt', 'utf8');
    const tasks = data.split('\n').map(taskLine => {
      const [taskName, priority, status] = taskLine.split(',');
      return { task: taskName, priority, status };
    });
    const taskIndex = tasks.findIndex((t, index) => index === parseInt(id)); 
    if (taskIndex !== -1) {
      tasks[taskIndex].task = task; 
    } else {
      return res.status(404).send("Task not found");
    }

    const updatedTasksText = tasks
      .map(t => `${t.task},${t.priority},${t.status}`)
      .join('\n');

    await writeFile('tasks.txt', updatedTasksText, 'utf8');
    res.status(200).send("Task updated successfully!");
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Error updating task");
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
