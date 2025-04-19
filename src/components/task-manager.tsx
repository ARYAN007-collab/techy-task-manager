import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash, Edit, Check, X } from 'lucide-react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import { Input } from "/components/ui/input"
import { Textarea } from "/components/ui/textarea"

type Task = {
  id: string
  title: string
  description: string
  category: string
  createdAt: Date
}

type Category = {
  id: string
  name: string
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'To Do' },
    { id: '2', name: 'In Progress' },
    { id: '3', name: 'Done' }
  ])
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt'>>({ 
    title: '', 
    description: '', 
    category: '1' 
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    // Load sample tasks
    setTasks([
      {
        id: '1',
        title: 'Set up project',
        description: 'Initialize the React project with TypeScript',
        category: '3',
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Design UI',
        description: 'Create wireframes for the task manager',
        category: '2',
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Implement animations',
        description: 'Add smooth transitions between states',
        category: '1',
        createdAt: new Date()
      }
    ])
  }, [])

  const handleAddTask = () => {
    if (!newTask.title.trim()) return
    
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      createdAt: new Date()
    }
    
    setTasks([...tasks, task])
    setNewTask({ title: '', description: '', category: '1' })
    setIsAddingTask(false)
  }

  const handleUpdateTask = () => {
    if (!editingTask?.title.trim()) return
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ))
    setEditingTask(null)
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) return
    
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory
    }
    
    setCategories([...categories, category])
    setNewCategory('')
  }

  const handleDeleteCategory = (id: string) => {
    // Move tasks to default category before deleting
    setTasks(tasks.map(task => 
      task.category === id ? { ...task, category: '1' } : task
    ))
    setCategories(categories.filter(cat => cat.id !== id))
  }

  const getCategoryName = (id: string) => {
    return categories.find(cat => cat.id === id)?.name || 'Uncategorized'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
        >
          Techy Task Manager
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Categories */}
          {categories.map(category => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-lg p-4 shadow-lg border-t-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                {category.id !== '1' && category.id !== '2' && category.id !== '3' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Tasks in this category */}
              <div className="space-y-3">
                <AnimatePresence>
                  {tasks
                    .filter(task => task.category === category.id)
                    .map(task => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-700 rounded-lg p-3 shadow"
                      >
                        {editingTask?.id === task.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingTask.title}
                              onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                              className="bg-gray-800 border-gray-600"
                            />
                            <Textarea
                              value={editingTask.description}
                              onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                              className="bg-gray-800 border-gray-600"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditingTask(null)}
                                className="border-gray-600"
                              >
                                <X className="h-4 w-4 mr-1" /> Cancel
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={handleUpdateTask}
                              >
                                <Check className="h-4 w-4 mr-1" /> Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-medium text-lg">{task.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setEditingTask(task)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>

              {/* Add task button for this category */}
              {category.id === '1' && !isAddingTask && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingTask(true)}
                    className="w-full border-dashed border-gray-600 hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Add new category */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-4 shadow-lg border-t-4 border-cyan-500"
          >
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <div className="flex space-x-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="bg-gray-700 border-gray-600"
              />
              <Button 
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Add task modal */}
        <AnimatePresence>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setIsAddingTask(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                <div className="space-y-4">
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Task title"
                    className="bg-gray-700 border-gray-600"
                  />
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Task description"
                    className="bg-gray-700 border-gray-600"
                    rows={3}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingTask(false)}
                      className="border-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddTask}
                      disabled={!newTask.title.trim()}
                    >
                      Add Task
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
