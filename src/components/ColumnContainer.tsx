import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Tasks } from "../types";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {CSS} from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";


interface Props {
    column: Column
    deleteColumn: (id: Id) => void
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    tasks: Tasks[];
    deleteTask: (taskId: Id) => void;
    updateTask: (taskId: Id, content: string) => void;
}
function ColumnContainer({ column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask }: Props) {
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(column.title);
    const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);
    

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const handleBlur = () => {
        setEditMode(false);
        if (inputValue !== column.title) {
            updateColumn(column.id, inputValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setEditMode(false);
            if (inputValue !== column.title) {
                updateColumn(column.id, inputValue);
            }
        }
    };

   

    if(isDragging) {
        return (
            <div
            ref={setNodeRef}
            style={style}
            className="bg-columnBackgroundColor opacity-60 border-2 border-rose-500 text-white w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        >
            <div
                {...attributes}
                {...listeners}
                className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
            >
                <div className="flex gap-2" onClick={() => setEditMode(true)}>
                    <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
                        0
                    </div>
                    {!editMode && column.title}
                    {editMode && (
                        <input
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                        />
                    )}
                </div>
                
            </div>

            <div className="flex flex-grow flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksId}>
                    {tasks.map(task => (
    
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>       
                    
                    ))}
                </SortableContext>
            </div>
            <button
                className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering edit mode
                    createTask(column.id);
                }}
            >
                <PlusIcon /> Add task
            </button>
        </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-columnBackgroundColor text-white w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        >
            <div
               
                className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
            >
                <div className="flex gap-2" onClick={() => setEditMode(true)}>
                    <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
                        0
                    </div>
                    {!editMode && column.title}
                    {editMode && (
                        <input
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                        />
                    )}
                </div>
                <button
                    className="hover:bg-columnBackgroundColor rounded px-1 py-2 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteColumn(column.id);
                    }}
                >
                    <Trash2Icon className="stroke-gray-150"/>
                </button>
            </div>

            <div className="flex flex-grow flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksId}>
                    {tasks.map(task => (
                    
                        
                            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                        
                    
                    
                    
                    ))}
                </SortableContext>
            </div>
            <button
                className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering edit mode
                    createTask(column.id);
                }}
            >
                <PlusIcon /> Add task
            </button>
        </div>
    );


    


    


}

export default ColumnContainer;
