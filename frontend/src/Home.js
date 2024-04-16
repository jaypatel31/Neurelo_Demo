import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getuserInfo, resetStatus, createNewTask, editTask, deleteTaskAction } from "./StateSlice/userSlice";
import { FaCheckCircle } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { CiSaveDown1 } from "react-icons/ci";
import { FaExclamationCircle } from "react-icons/fa";
import CreatableSelect from 'react-select/creatable';
import { addCategory, getAllCategory, resetCategory } from "./StateSlice/categorySlice";
import { DatePicker, Stack } from 'rsuite';
import { FaCalendarCheck, FaClock } from 'react-icons/fa';
import 'rsuite/dist/rsuite.min.css';
import { toast } from "react-toastify";
import { MdDelete, MdModeEdit } from "react-icons/md";
import swal from "sweetalert";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'


const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
  ];

const Home = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    const [userNewTasks, setUserNewTasks] = useState([])
    const [userProgTasks, setUserProgTasks] = useState([])
    const [userCompTasks, setUserCompTasks] = useState([])
    const [userDueTasks, setUserDueTasks] = useState([])

    const [categoryLoading, setCategoryLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [modal, setModal] = useState(false)
    const [type, setType] = useState("")
    const [search, setSearch] = useState("")

    const [taskTitle, setTaskTitle] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [taskStatus, setTaskStatus] = useState("New")
    const [currentCategory, setCurrentCategory] = useState([])
    const [dueDate, setDueDate] = React.useState(new Date());
    const [id, setId] = useState("")
      
    var daysLeft = function(input) {    
        var inputDate = new Date(input);
        var today = new Date();
        var timeDiff = inputDate.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1000*3600*24));
    };

    const {state,userInfo,error, taskCreationStatus} = useSelector((state) => state.user)
    const {categoryStatus,categoryInfo,categoryError, newCreated } = useSelector((state) => state.category)


    useEffect(() => {
        if(!userInfo){
            let token = localStorage.getItem("todotoken")
            if(!token){
                navigate("/login",{replace:true})
            }else{
                dispatch(getuserInfo({token}))
            }
        }
    }, [])

    useEffect(() => {
     if(userInfo){
        const regex = new RegExp(search, "i");
        let newTask = []
        let ProgTask = []
        let CompTask = []
        let DueTask = []
        userInfo.tasks.forEach((item)=>{
            if(search===""){
                if(item.status === "NEW") newTask.push(item)
                if(item.status === "INPROGRESS") ProgTask.push(item)
                if(item.status === "COMPLETED") CompTask.push(item)
                if(item.status === "PENDING") DueTask.push(item)
            }else{
                if(item.status === "NEW" && regex.test(item.title)) newTask.push(item)
                if(item.status === "INPROGRESS" && regex.test(item.title)) ProgTask.push(item)
                if(item.status === "COMPLETED" && regex.test(item.title)) CompTask.push(item)
                if(item.status === "PENDING" && regex.test(item.title)) DueTask.push(item)
            }
            
        })
        setUserNewTasks(newTask)
        setUserProgTasks(ProgTask)
        setUserCompTasks(CompTask)
        setUserDueTasks(DueTask)

        let token = localStorage.getItem("todotoken")
        dispatch(getAllCategory({token}))
     }
    }, [userInfo, search])


    const handleCreate = (inputValue) => {
        setCategoryLoading(true)
        let token = localStorage.getItem("todotoken")
        dispatch(addCategory({categoryData:{categoryName:inputValue},token:token}))  
    }

    useEffect(()=>{
        if(categoryInfo){
            let data = categoryInfo.map((item)=>{
                return {
                    value: item.id,
                    label: item.categoryName
                }
            })
            if(newCreated) setCurrentCategory(prev=>[...prev,{value:newCreated.id,label:newCreated.categoryName}])
            console.log(data)
            setCategoryData(data)
            dispatch(resetCategory())
            setCategoryLoading(false)
        }
    },[categoryInfo])

    const handleTask = () => {
        if(currentCategory.length === 0){
            toast.error("Please select Atleast One category")
        }
        else if(taskTitle === ""){
            toast.error("Please enter Task Title")
        }
        else if(taskDescription === ""){
            toast.error("Please enter Task Description")
        }
        else if(dueDate === ""){
            toast.error("Please enter Task Due Date")
        }
        else{
            let taskCategories = currentCategory.map((item)=>item.value)
                let token = localStorage.getItem("todotoken")
                let payload = {
                    taskName:taskTitle,
                    taskDescription,
                    taskStatus,
                    taskCategories,
                    taskDueDate:dueDate
                }
            if(type==="edit"){
                payload.taskId = id
                dispatch(editTask({payload,token}))
            }else{
                dispatch(createNewTask({payload,token}))
            }
        }
    }

    const deleteTask = (id) => {
        swal({
            title: `Delete Task`,
            text: `Once Deleted, Task will not be recovered!`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willReactive) => {
            // console.log(willReactive);
            if (willReactive) {
              let token = localStorage.getItem("todotoken");
              if (token) {
                setType("delete")
                dispatch(deleteTaskAction({ id, token }));
              } else {
                navigate("/404", { replace: true });
              }
            }
          });
    }

    useEffect(() => {
      if(taskCreationStatus){
        toast.success(type==="edit"?"Task Updated Succesfully":type==='delete'?"Task Deleted Succesfully":"Task Created Successfully")
        setTaskTitle("")
        setTaskDescription("")
        setTaskStatus("NEW")
        setCurrentCategory([])
        setDueDate(new Date())
        dispatch(resetStatus())
        setType("")
        setModal(false)
      }
    }, [taskCreationStatus])
    
    
    return (
        <div className="w-9/12 m-auto pt-16">
            {/* <!-- Main modal --> */}
<div id="default-modal" tabIndex="-1" aria-hidden="true" class={modal?"overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-100/50" :"hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-100/50"}>
    <div class="absolute right-2/4 bottom-2/4 p-4 w-full max-w-2xl max-h-full" style={{transform:"translate(50%, 50%)"}}>
        {/* <!-- Modal content --> */}
        <div class="relative bg-white rounded-lg shadow-md ">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 class="text-xl font-semibold text-gray-900 ">
                    {type==="edit"?"Edit ":"Add New "}Task
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="default-modal" onClick={()=>setModal(false)}>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <div class="p-4 md:p-5 space-y-4">
                <div class="sm:col-span-4">
                    <label for="task_title" class="block text-sm font-medium leading-6 text-gray-900">Task Title</label>
                    <div class="mt-2">
                        <input id="task_title" name="task_title" type="task_title" value={taskTitle} onChange={(e)=>setTaskTitle(e.target.value)}  class="pl-2 outline-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                </div>
                <div class="col-span-full">
                    <label for="task_description" class="block text-sm font-medium leading-6 text-gray-900">Task Description</label>
                    <div class="mt-2">
                        <textarea id="task_description" name="task_description" rows="3" class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none" value={taskDescription} onChange={(e)=>setTaskDescription(e.target.value)}/>
                    </div>
                </div>
                <div class="col-span-full">
                    <label for="due_date" class="block text-sm font-medium leading-6 text-gray-900">Task Due Date</label>
                    <div class="mt-2">
                    <DatePicker
                        format="dd MMM yyyy hh:mm:ss aa"
                        showMeridian
                        caretAs={FaCalendarCheck}
                        style={{ width: 220 }}
                        value={dueDate} onChange={(value)=>setDueDate(value)}
                        />
                    </div>
                </div>
                <div class="col-span-full">
                    <label for="country" class="block text-sm font-medium leading-6 text-gray-900">Task Status</label>
                    <div class="mt-2">
                        <select id="country" name="country" onChange={(e)=>setTaskStatus(e.target.value)} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 outline-none">
                        <option value="NEW" selected={taskStatus==="NEW"}>New</option>
                        <option value="INPROGRESS" selected={taskStatus==="INPROGRESS"}>Inprogress</option>
                        <option value="COMPLETED" selected={taskStatus==="COMPLETED"}>Completed</option>
                        <option value="PENDING" selected={taskStatus==="PENDING"}>Pending</option>
                        </select>
                    </div>
                </div>
                <div class="col-span-full">
                    <label for="category" class="block text-sm font-medium leading-6 text-gray-900">Task Category</label>
                    <div class="mt-2">
                    <CreatableSelect isMulti options={categoryData} onCreateOption={handleCreate} isLoading={categoryLoading} onChange={(e)=>{
                        setCurrentCategory(e)
                    }} value={currentCategory}/>
                    </div>
                </div>
                
            </div>

            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
                <button onClick={handleTask} data-modal-hide="default-modal" type="button" class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">{type==="edit"?"Update":"Submit"}</button>
                
            </div>
        </div>
    </div>
</div>
            <h1 class="text-4xl text-center font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">To Do List</h1>
            <form class="max-w-md mx-auto mb-4">   
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-indigo-500 outline-none" placeholder="Search Tasks By Name" required onChange={(e)=>setSearch(e.target.value)} value={search}/>
                    {/* <button type="button" class="text-white absolute end-2.5 bottom-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Search</button> */}
                </div>
            </form>
            <button
                  type="button"
                  className="flex m-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  style={{maxWidth:"28rem"}}
                    // onClick={submitAction}
                    // disabled={loading}
                    data-modal-target="default-modal" 
                    data-modal-toggle="default-modal" 
                    onClick={()=>{
                        setTaskTitle("")
                        setTaskDescription("")
                        setTaskStatus("NEW")
                        setCurrentCategory([])
                        setDueDate(new Date())
                        setType("")
                        setModal(true)
                    }}
                >
                    
                    
                    {/* <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg> */}
                  Add New Task
                </button>
        <ul role="list" class="divide-y divide-gray-100 mt-4">

            {
                userNewTasks.length === 0 && userProgTasks.length === 0 && userDueTasks.length === 0 && userCompTasks.length === 0 && (
                    <div className="flex justify-center items-center h-96">
                        <h1 className="text-2xl font-semibold text-gray-900">No Task Found</h1>
                    </div>
                )
            }

            {
                userNewTasks.length > 0 && (
                    <div className="mb-2 border-0" style={{borderTop:"0px"}}>
                        <div className="max-w-screen-xl mx-auto">
                        <div className="items-start justify-between py-4 border-b md:flex">
                            <div>
                                <h3 className="text-gray-800 text-xl font-bold">
                                    Newly Added Tasks
                                </h3>
                            </div>
                        </div>
                    </div>

                        {
                            userNewTasks.length > 0 && userNewTasks.map((item,index)=>{
                                return (
                                    <li class={`flex justify-between flex-col gap-4 sm:gap-0 sm:flex-row gap-x-6 py-5 border-t-0 ${index!==userNewTasks.length-1?"border-b":""}`} style={{borderTop:"0px"}}>
                                        <div class="flex min-w-0 gap-x-4">
                                        <CiSaveDown1 class="h-8 w-8 flex-none rounded-full text-indigo-500"/>
                                        <div class="min-w-0 flex-auto">
                                            <p class="text-sm font-semibold leading-6 text-gray-900 mb-2">
                                                {item.title}
                                                <div className="flex  items-center space-x-3 mt-1">
                                                    {
                                                        item.categoryIds.map((cat)=>{
                                                            return <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">{categoryData.find(ct=>ct.value===cat)?.label}</span>
                                                        })
                                                    }
                                                </div>
                                            </p>
                                            <p class="mt-1 truncate text-xs leading-5 text-gray-500">{item.description}</p>
                                        </div>
                                        </div>
                                        <div class="shrink-0 flex justify-between items-start sm:flex sm:flex-col">
                                            <div>
                                                <p class={`text-sm leading-6 ${new Date().getTime() >= new Date(item.dueDate).getTime()?"text-red-900":"text-gray-900"}`}>Due:  {formatDistance(new Date(item.dueDate), new Date(), { addSuffix: true })}</p>
                                                <p class="mt-1 text-xs leading-5 text-gray-500">Last Updated: <time datetime="2023-01-23T13:23Z">{new Date(item.updatedAt).toDateString()}</time></p>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button className=" rounded-md bg-blue-600 px-2 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={()=>{
                                                    setTaskDescription(item.description)
                                                    setTaskTitle(item.title)
                                                    setTaskStatus(item.status)
                                                    setCurrentCategory(item.categoryIds.map((cat)=>{return {value:cat,label:categoryData.find(ct=>ct.value===cat)?.label}}))
                                                    setDueDate(new Date(item.dueDate))
                                                    setModal(true)
                                                    setType("edit")
                                                    setId(item.id)
                                                }}><MdModeEdit size={'18'} /></button> 
                                                
                                                <button className=" rounded-md bg-red-600 px-2 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onClick={()=>deleteTask(item.id)}><MdDelete size={'18'}/></button> 
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                </div>
                )
            }

            {
                userProgTasks.length > 0 && (
                    <div className="mb-2 border-0" style={{borderTop:"0px"}}>
                        <div className="max-w-screen-xl mx-auto">
                        <div className="items-start justify-between py-4 border-b md:flex">
                            <div>
                                <h3 className="text-gray-800 text-xl font-bold">
                                    In Progress Tasks
                                </h3>
                            </div>
                        </div>
                    </div>

                        {
                            userProgTasks.length > 0 && userProgTasks.map((item,index)=>{
                                return (
                                    <li class={`flex justify-between flex-col gap-4 sm:gap-0 sm:flex-row gap-x-6 py-5 border-t-0 ${index!==userProgTasks.length-1?"border-b":""}`} style={{borderTop:"0px"}}>
                                        <div class="flex min-w-0 gap-x-4">
                                        <GrInProgress class="h-8 w-8 flex-none rounded-full text-blue-500"/>
                                        <div class="min-w-0 flex-auto">
                                            <p class="text-sm font-semibold leading-6 text-gray-900 mb-2">
                                                {item.title}
                                                <div className="flex  items-center space-x-3 mt-1">
                                                    {
                                                        item.categoryIds.map((cat)=>{
                                                            return <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">{categoryData.find(ct=>ct.value===cat)?.label}</span>
                                                        })
                                                    }
                                                </div>
                                            </p>
                                            <p class="mt-1 truncate text-xs leading-5 text-gray-500">{item.description}</p>
                                        </div>
                                        </div>
                                        <div class="hidden flex justify-between items-start shrink-0 sm:flex sm:flex-col">
                                            <div>
                                            <p class={`text-sm leading-6 ${new Date().getTime() >= new Date(item.dueDate).getTime()?"text-red-900":"text-gray-900"}`}>Due:  {formatDistance(new Date(item.dueDate), new Date(), { addSuffix: true })}</p>
                                                <p class="mt-1 text-xs leading-5 text-gray-500">Last Updated: <time datetime="2023-01-23T13:23Z">{new Date(item.updatedAt).toDateString()}</time></p>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button className=" rounded-md bg-blue-600 px-2 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={()=>{
                                                    setTaskDescription(item.description)
                                                    setTaskTitle(item.title)
                                                    setTaskStatus(item.status)
                                                    setCurrentCategory(item.categoryIds.map((cat)=>{return {value:cat,label:categoryData.find(ct=>ct.value===cat)?.label}}))
                                                    setDueDate(new Date(item.dueDate))
                                                    setModal(true)
                                                    setType("edit")
                                                    setId(item.id)
                                                }}><MdModeEdit size={'18'} /></button> 
                                                
                                                <button className=" rounded-md bg-red-600 px-2 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onClick={()=>deleteTask(item.id)}><MdDelete size={'18'}/></button> 
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </div>
                )
            }

            {
                userDueTasks.length > 0 && (
                    <div className="mb-2 border-0" style={{borderTop:"0px"}}>
                <div className="max-w-screen-xl mx-auto">
                <div className="items-start justify-between py-4 border-b md:flex">
                    <div>
                        <h3 className="text-gray-800 text-xl font-bold">
                            Due Tasks
                        </h3>
                    </div>
                </div>
            </div>

                {
                    userDueTasks.length > 0 && userDueTasks.map((item, index)=>{
                        return (
                            <li class={`flex justify-between flex-col gap-4 sm:gap-0 sm:flex-row gap-x-6 py-5 border-t-0 ${index!==userDueTasks.length-1?"border-b":""}`} style={{borderTop:"0px"}}>
                                <div class="flex min-w-0 gap-x-4">
                                <FaExclamationCircle class="h-8 w-8 flex-none rounded-full text-red-500"/>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm font-semibold leading-6 text-gray-900 mb-2">
                                        {item.title}
                                        <div className="flex  items-center space-x-3 mt-1">
                                            {
                                                item.categoryIds.map((cat)=>{
                                                    return <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">{categoryData.find(ct=>ct.value===cat)?.label}</span>
                                                })
                                            }
                                        </div>
                                    </p>
                                    <p class="mt-1 truncate text-xs leading-5 text-gray-500">{item.description}</p>
                                </div>
                                </div>
                                <div class="hidden flex justify-between items-start shrink-0 sm:flex sm:flex-col">
                                    <div>
                                        <p class={`text-sm leading-6 ${new Date().getTime() >= new Date(item.dueDate).getTime()?"text-red-900":"text-gray-900"}`}>Due:  {formatDistance(new Date(item.dueDate), new Date(), { addSuffix: true })}</p>
                                        <p class="mt-1 text-xs leading-5 text-gray-500">Last Updated: <time datetime="2023-01-23T13:23Z">{new Date(item.updatedAt).toDateString()}</time></p>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                                <button className=" rounded-md bg-blue-600 px-2 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={()=>{
                                                    setTaskDescription(item.description)
                                                    setTaskTitle(item.title)
                                                    setTaskStatus(item.status)
                                                    setCurrentCategory(item.categoryIds.map((cat)=>{return {value:cat,label:categoryData.find(ct=>ct.value===cat)?.label}}))
                                                    setDueDate(new Date(item.dueDate))
                                                    setModal(true)
                                                    setType("edit")
                                                    setId(item.id)
                                                }}><MdModeEdit size={'18'} /></button> 
                                                
                                                <button className=" rounded-md bg-red-600 px-2 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onClick={()=>deleteTask(item.id)}><MdDelete size={'18'}/></button> 
                                            </div>
                                </div>
                            </li>
                        )
                    })
                }
                    </div>
                )
            }

            {
                userCompTasks.length > 0 && (
                    <div className="mb-2 border-0" style={{borderTop:"0px"}}>
                    <div className="max-w-screen-xl mx-auto ">
                    <div className="items-start justify-between py-4 border-b md:flex">
                        <div>
                            <h3 className="text-gray-800 text-xl font-bold">
                                Completed Tasks
                            </h3>
                        </div>
                    </div>
                    </div>
    
                    {
                        userCompTasks.length > 0 && userCompTasks.map((item, index)=>{
                            return (
                                <li class={`flex justify-between flex-col gap-4 sm:gap-0 sm:flex-row gap-x-6 py-5 border-t-0 ${index!==userCompTasks.length-1?"border-b":""}`} style={{borderTop:"0px"}}>
                                    <div class="flex min-w-0 gap-x-4">
                                    <FaCheckCircle class="h-8 w-8 flex-none rounded-full text-green-500"/>
                                    <div class="min-w-0 flex-auto">
                                        <p class="text-sm font-semibold leading-6 text-gray-900 mb-2">
                                            {item.title}
                                            <div className="flex  items-center space-x-3 mt-1">
                                                {
                                                    item.categoryIds.map((cat)=>{
                                                        return <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">{categoryData.find(ct=>ct.value===cat)?.label}</span>
                                                    })
                                                }
                                            </div>
                                        </p>
                                        <p class="mt-1 truncate text-xs leading-5 text-gray-500">{item.description}</p>
                                    </div>
                                    </div>
                                    <div class="flex justify-between items-start shrink-0 sm:flex sm:flex-col ">
                                        <div>
                                            {/* <p class={`text-sm leading-6 ${new Date().getTime() >= new Date(item.dueDate).getTime()?"text-red-900":"text-gray-900"}`}>Due:  {formatDistance(new Date(item.dueDate), new Date(), { addSuffix: true })}</p> */}
                                            <p class="mt-1 text-xs leading-5 text-gray-500">Last Updated: <time datetime="2023-01-23T13:23Z">{new Date(item.updatedAt).toDateString()}</time></p>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                                <button className=" rounded-md bg-blue-600 px-2 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={()=>{
                                                    setTaskDescription(item.description)
                                                    setTaskTitle(item.title)
                                                    setTaskStatus(item.status)
                                                    setCurrentCategory(item.categoryIds.map((cat)=>{return {value:cat,label:categoryData.find(ct=>ct.value===cat)?.label}}))
                                                    setDueDate(new Date(item.dueDate))
                                                    setModal(true)
                                                    setType("edit")
                                                    setId(item.id)
                                                }}><MdModeEdit size={'18'} /></button> 
                                                
                                                <button className=" rounded-md bg-red-600 px-2 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onClick={()=>deleteTask(item.id)}><MdDelete size={'18'}/></button> 
                                            </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                    </div>
                )
            }

            

            

            


            </ul>
        </div>
    );
}

export default Home;