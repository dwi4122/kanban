import { PlusIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { Column, Id, Tasks } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";




function KanbanBoard() {
   const [columns, setColumns] = useState<Column[]>([]);
   const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
   const [tasks,setTasks] = useState<Tasks[]>([]);

   const [activeColumn, setActiveColumn] = useState<Column | null>(null);
   const [activeTask, setActiveTask] = useState<Tasks | null>(null);

   const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 30
        },
    })
   )
    

    

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}> 
            <div className="m-auto flex gap-4">
                <div className="flex gap-2">
                    <SortableContext items={columnsId}>
                    {
                    columns.map(column => 
                        <div>
                            <ColumnContainer column={column} key={column.id} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} deleteTask={deleteTask} updateTask={updateTask} tasks={tasks.filter(task=> task.columnId === column.id )}/>
                        </div>
                    )}
                    </SortableContext>
                </div>
                <button className=" text-white h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColorp-4 ring-rose-600hover:ring-2 flex gap"
                        onClick={createNewColumn}>
                    <PlusIcon/>
                    Add Column
                </button>
            
            </div>
           
            {createPortal(<DragOverlay>
                {activeColumn && <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} deleteTask={deleteTask} updateTask={updateTask} tasks={tasks.filter((task)=> task.columnId === activeColumn.id )}
                    />}
                    {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>}
            </DragOverlay>, document.body)}
                    
                
            
           
            </DndContext>
        </div>
    )


    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length +1}`
        };
    
        setColumns([...columns, columnToAdd]);
    }

    function deleteColumn(id: Id) {
        const filteredColumn = columns.filter(col => col.id !== id);
        setColumns(filteredColumn);

        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks);
        
    }

    function updateColumn (id: Id, title: string) {
        
        const newColumns = columns.map(col => {
            if(col.id !== id) return col;
            return {...col, title};
        })

        setColumns(newColumns);
    }

    function createTask(columnId: Id) {
        const newTask: Tasks = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`      
        }

        setTasks([...tasks, newTask]);
    }

    function deleteTask(taskId: Id) {
        const newTasks = tasks.filter(task => task.id !== taskId);
        setTasks(newTasks);
    }

    function updateTask(taskId:Id, content: string) {
        const newTasks= tasks.map(task => {
            if(task.id !== taskId) {
                return task;
            }
            return {...task, content};
        })

        setTasks(newTasks);
    }

    
    function onDragStart(event: DragStartEvent) {
      
       
        
        if(event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if(event.active.data.current?.type === "Tasks") {
            setActiveTask(event.active.data.current.task);
            return;
        }
             
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);
        const {active, over} = event;

        if(!over) {
            return
        }
        const activeColumnID = active.id;
        const overColumnID = over.id;

        if(activeColumnID === overColumnID) {
            return
        }

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnID)

            const overColumnIndex = columns.findIndex(col => col.id === overColumnID)

            return arrayMove(columns, activeColumnIndex, overColumnIndex );
        })

       
    }

    function onDragOver(event: DragOverEvent) {
        const {active, over} = event;

        if(!over) {
            return
        }
        const activeColumnID = active.id;
        const overColumnID = over.id;

        if(activeColumnID === overColumnID) {
            return
        }

        const isActiveATask = active.data.current?.type === "Tasks";
        const isOverATask = over.data.current?.type === "Tasks";

        if (!isActiveATask ) return;

        if(isActiveATask && isOverATask) {
            setTasks(tasks => {
                const ActiveIndex = tasks.findIndex(t => t.id === active.id);
                const OverIndex = tasks.findIndex(t => t.id === over.id);

                if (tasks[ActiveIndex].columnId !== tasks[OverIndex].columnId) {
                    tasks[ActiveIndex].columnId = tasks[OverIndex].columnId;
                }

                return arrayMove(tasks,ActiveIndex, OverIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        if(isActiveATask && isOverAColumn) {
            setTasks(tasks => {
                const ActiveIndex = tasks.findIndex(t => t.id === active.id);
               

                
                    tasks[ActiveIndex].columnId = over.id;
                

                return arrayMove(tasks,ActiveIndex, ActiveIndex);
            });

        }

    }

    
       
    
}



function generateId() {
    return Math.floor(Math.random() * 1001);
}

export default KanbanBoard
