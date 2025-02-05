let Submit_Click = document.querySelector("[type='submit']");
let Text_Input = document.querySelector("[type='text']");
let Date_Input = document.querySelector("[type='date']");
let option_filter = document.querySelector("#filter");
let Show_Data = document.querySelector(".show-data");
let Array_Task = [];

if (localStorage.getItem("ArrTask")) {
	Array_Task = JSON.parse(localStorage.getItem("ArrTask"));
}

ReturnDateFromLocal()

Submit_Click.addEventListener("click" , () => {
	addTaskToArr(Text_Input.value,Date_Input.value);
	Text_Input.value = '';
	Date_Input.value = '';
})

function  addTaskToArr(text,date) {
	let today = new Date().toISOString().slice(0,10);
	let task = {
	id: "a" +  Date.now(),
	title: text !== "" ? text : "...",
	date: date !== "" ? date : today,
	completed: false,
	} 
	Array_Task.push(task);
	addTaskFromLocalString(Array_Task)
	addTaskToPage(Array_Task)
} 
function addTaskToPage(elements) {
	Show_Data.innerHTML = "";
	elements.forEach(task => {
	let New_Task = document.createElement("div");
    New_Task.className = "task";
		task.completed ? New_Task.classList.add("done") : "";
    New_Task.id = task.id;
    New_Task.setAttribute("data-time",task.date)
    New_Task.innerHTML = `
		<span class='check '> <img src="./icon/check-solid.svg" class='check-child'></img></span>
		<div class="data-task">
    <h4>${task.title}</h4>
    <p>${task.date}</p>
		</div>
    <img src="./icon/pen-solid.svg" class='pen'></img>
    <img src="./icon/trash-solid.svg" class='delete'></img>
    `;
    Show_Data.appendChild(New_Task)
		});
}
Show_Data.addEventListener("click" , (task) => {
	if(task.target.classList.contains("delete")) {
		task.target.parentElement.remove()
		deleteTheTaskFromArray(task.target.parentElement.getAttribute("id"))
	} else if (task.target.classList.contains("pen")) {
		editingContent(task.target.parentElement)
	}else if (task.target.classList.contains("check")) {
		task.target.parentElement.classList.toggle("done");
		completedCheck(task.target.parentElement)
	}else if (task.target.classList.contains("check-child")) {
		task.target.parentElement.parentElement.classList.toggle("done");
		completedCheck(task.target.parentElement.parentElement)
	}
})
function editingContent(editElement) {
	let ids =  "#" + editElement.getAttribute("id");
	let h4_value = document.querySelector(`${ids} h4`);
	let p_value = document.querySelector(`${ids} p`);
	let divEditInput = document.createElement("div");
	divEditInput.className = "editing"
  let popupInputText = document.createElement("input");
	popupInputText.type = "text";
	popupInputText.value = h4_value.innerHTML;
  let popupInputDate = document.createElement("input");
	popupInputDate.type = "date";
	popupInputDate.value = p_value.innerHTML;
  let popupInputSubmit = document.createElement("input");
	popupInputSubmit.type = "submit";
	popupInputSubmit.value = "Save";
	divEditInput.appendChild(popupInputText)
	divEditInput.appendChild(popupInputDate)
	divEditInput.appendChild(popupInputSubmit)
	document.querySelector(".container").append(divEditInput)
	popupInputSubmit.addEventListener("click" , ()=> {
		h4_value.innerText = popupInputText.value;
		p_value.innerText = popupInputDate.value;
		editElement.dataset.time = popupInputDate.value;
		console.log(editElement)
			for(let i = 0; i < Array_Task.length; i++) {
				if(Array_Task[i].id == editElement.getAttribute("id")) {
					Array_Task[i].title = popupInputText.value;
					Array_Task[i].date = popupInputDate.value;
				}
			}
			divEditInput.remove()
			addTaskFromLocalString(Array_Task)
	})
}

function deleteTheTaskFromArray(taskId) {
  Array_Task = Array_Task.filter(ArrTask =>  ArrTask.id != taskId);
	addTaskFromLocalString(Array_Task) 
}
function addTaskFromLocalString(keepTask) {
	window.localStorage.setItem("ArrTask", JSON.stringify(keepTask))
}
function ReturnDateFromLocal() {
	let data = window.localStorage.getItem("ArrTask");
	if(data) {
		addTaskToPage(JSON.parse(data))
	}
}

function completedCheck(ele) {
  Array_Task.forEach((element) => {
		if(element.id == ele.id) {
			element.completed = ele.classList.contains("done");
		}
	})
	addTaskFromLocalString(Array_Task) 
}

// Option Filter 
option_filter.addEventListener("click", option => {
	let all_task = document.querySelectorAll(".task");
	let value_option = option.target.value;
	all_task.forEach((task) => {
		let get_now_date = new Date(task.dataset.time).getTime();
		let get_date = new Date().getTime();
		let date_rest =  Math.ceil((get_now_date - get_date)/ (1000 * 60 * 60 * 24 ));
		task.style.display = "none";
		if(value_option == "all") {
			task.style.display = "flex";
		} else if (value_option === "present") {
			if(date_rest == 1 || date_rest == 0) {
				task.style.display = "flex";
			}
		}else if (value_option === "past") {
			if(date_rest < 0) {
				task.style.display = "flex";
			}
		} else if (value_option === "future") {
			if(date_rest > 1) {
				task.style.display = "flex";
			}
		} else if (value_option === "done") {
			if(task.classList.contains("done")){
				task.style.display = "flex";
			}
			
		} else if (value_option === "noDone") {
			if(!task.classList.contains("done")){
				task.style.display = "flex";
			}
		} 
	})
	});