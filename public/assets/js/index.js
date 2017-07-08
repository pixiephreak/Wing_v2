$(document).ready(function() {
    console.log('client js linked');
    var currentCustomer;
    var customerId;
    var tasks;

    // Container holds all of our tasks
    var taskContainer = $(".outstanding-tasks");
    var postCategorySelect = $("#category");

    //customer constructor
    var Customer = function(firstName, lastName, phone, email, streetaddress, streetaddress2, city, state, zip, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.streetaddress = streetaddress;
        this.streetaddress2 = streetaddress2;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.password = password;
    };

    //login constructor
    var Login = function(email, password) {
        this.email = email;
        this.password = password;
    };

    //task constructor
    var Task = function(title, description, tools, timeframe, payment, payment_type, status, customerId) {
        this.title = title;
        this.description = description;
        this.tools = tools;
        this.timeframe = timeframe;
        this.payment = payment;
        this.payment_type = payment_type;
        this.status = status;
        this.customerId = customerId;
    };

    var getUrl = function() {
        var pathArray = location.href.split('/');
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + '//' + host;
        return url;
    };

    // how should we validate form data? express-validator b4 it goes to DB...?
    // validator.js express-validator?

    //*************************************************
    //  CREATE PROFILE
    //*************************************************
    if (document.getElementById('submit-profile')) {
        document.getElementById('submit-profile').onclick = function(event) {
            event.preventDefault();
            console.log('submit');

            var firstName = document.getElementById('first-name').value.trim();
            var lastName = document.getElementById('last-name').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var email = document.getElementById('email').value.trim();
            var streetaddress = document.getElementById('street-address').value.trim();
            var streetaddress2 = document.getElementById('street-address2').value.trim();
            var city = document.getElementById('city').value.trim();
            var state = document.getElementById('state').value.trim();
            var password = document.getElementById('password').value.trim();
            var zip = document.getElementById('zip').value.trim();

            var newCustomer = new Customer(firstName, lastName, phone, email, streetaddress, streetaddress2, city, state, zip, password);
            //find url in req body object and cocotonate
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": getUrl() + '/api/userprofile',
                "method": "POST",
                "dataType": "json",
                "headers": {
                    "cache-control": "no-cache"
                },
                "contentType": "application/json",
                "data": JSON.stringify(newCustomer)
            };

            $.ajax(settings).done(function(response) {

                localStorage.setItem('currentCustomer', response.id);
                window.location.href = "/select";
            });
        };
    }


    //*************************************************
    //  SUBMIT TASK
    //*************************************************
    if (document.getElementById('submit-task')) {
        // send task form data
        document.getElementById('submit-task').onclick = function(event) {
            event.preventDefault();
            customerId = localStorage.getItem('currentCustomer');
            console.log(customerId);

            var title = document.getElementById('task-title').value.trim();
            var description = document.getElementById('description').value.trim();
            var tools = document.getElementById('tools').value.trim();
            var timeframe = document.getElementById('timeframe').value.trim();
            var payment = document.getElementById('compensation').value.trim();
            var payment_type = document.querySelector(`input[name = "payment-type"]:checked`).value;
            //TO-DO: we shoudl use a boolean here in model
            var status = 'true';
            // var payment_type = document.getElementById('payment-type').value.trim();
            // var status = document.getElementById('status').value.trim();

            var newTask = new Task(title, description, tools, timeframe, payment, payment_type, status, customerId);
            console.log(newTask);

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": getUrl() + '/api/task',
                "method": "POST",
                "dataType": "json",
                "headers": {
                    "cache-control": "no-cache"
                },
                "contentType": "application/json",
                "data": JSON.stringify(newTask)
            };

            $.ajax(settings).done(function(response) {
                //console.log(response);
                window.location.href = "/task_list";
            });
        };
    }

    //*************************************************
    //  SEE ALL TASKS
    //*************************************************
    if (document.getElementById('see-all-tasks')) {
        // send task form data
        document.getElementById('see-all-tasks').onclick = function(event) {
            event.preventDefault();
            window.location.href = "/contractor";
        };
    }
    // The code below handles the case where we want to get blog tasks for a specific customer
    // Looks for a query param in the url for customer_id
    var url = window.location.search;
    if (url.indexOf("?customerId=") !== -1) {
        customerId = url.split("=")[1];
        getTasks(customerId);
    }
    // If there's no customerId we just get all Tasks as usual
    else {
        getTasks();
    }

    // This function grabs Tasks from the database and updates the view
    function getTasks(customer) {
        customerId = customer || "";
        if (customerId) {
            customerId = "/?customerId=" + customerId;
        }
        $.get("/api/task" + customerId, function(data) {
            console.log("Tasks", data);
            tasks = data;
            if (!tasks || !tasks.length) {
                displayEmpty(customer);
            } else {
                initializeRows();
            }
        });
    }

    // This function displays a messgae when there are no tasks
    function displayEmpty(id) {
        var query = window.location.search;
        var partial = "";
        if (id) {
            partial = " for Customer #" + id;
        }
        taskContainer.empty();
        var messageh2 = $("<h2>");
        messageh2.css({
            "text-align": "center",
            "margin-top": "50px"
        });
        messageh2.html("No tasks yet" + partial + ", navigate <a href='/cms" + query +
            "'>here</a> in order to get started.");
        taskContainer.append(messageh2);
    }

    // InitializeRows handles appending all of our constructed task HTML inside blogContainer
    function initializeRows() {
        taskContainer.empty();
        var tasksToAdd = [];
        for (var i = 0; i < tasks.length; i++) {
            tasksToAdd.push(createNewRow(tasks[i]));
        }
        taskContainer.append(tasksToAdd);
    }

    // This function constructs a post's HTML
    function createNewRow(task) {
        var newTaskPanel = $("<div>");
        newTaskPanel.addClass("panel panel-default");
        var newTaskPanelHeading = $("<div>");
        newTaskPanelHeading.addClass("panel-heading");
        var deleteBtn = $("<button>");
        deleteBtn.text("DELETE");
        deleteBtn.addClass("delete btn btn-danger");
        var editBtn = $("<button>");
        editBtn.text("EDIT");
        editBtn.addClass("edit btn btn-info");
        var newTaskTitle = $("<h2>");
        var newTaskDate = $("<small>");
        var newTaskCustomer = $("<h5>");
        // newTaskCustomer.text("Written by: " + task.Task.first_name);
        // newTaskCustomer.css({
        //   float: "right",
        //   color: "blue",
        //   "margin-top":
        //   "-10px"
        // });
        var newTaskPanelBody = $("<div>");
        newTaskPanelBody.addClass("panel-body");
        var newTaskDescription = $("<p>");
        var newTaskTools = $("<p>");
        var newTaskTimeframe = $("<p>");
        var newTaskPayment = $("<p>");
        var newTaskPaymentType = $("<p>");
        var newTaskStatus = $("<p>");

        newTaskTitle.text("Title: " + task.title + " ");
        newTaskDescription.text("Description: " +task.description + " ");
        newTaskTools.text("Tools: " +task.tools + " ");
        newTaskTimeframe.text("Timeframe: " +task.timeframe + " ");
        newTaskPayment.text("Payment: " +task.payment + " ");
        newTaskPaymentType.text("Payment Type: " +task.payment_type + " ");
        newTaskStatus.text("Status: " +task.status + " ");

        //newTaskDate.text(formattedDate);
        newTaskTitle.append(newTaskDate);
        newTaskPanelHeading.append(deleteBtn);
        newTaskPanelHeading.append(editBtn);
        newTaskPanelHeading.append(newTaskTitle);
        //newTaskPanelHeading.append(newTaskCustomer);
        newTaskPanelBody.append(newTaskDescription);
        newTaskPanelBody.append(newTaskTools);
        newTaskPanelBody.append(newTaskTimeframe);
        newTaskPanelBody.append(newTaskPayment);
        newTaskPanelBody.append(newTaskPaymentType);
        newTaskPanelBody.append(newTaskStatus);
        newTaskPanel.append(newTaskPanelHeading);
        newTaskPanel.append(newTaskPanelBody);
        newTaskPanel.data("task", task);
        return newTaskPanel;
    }

    //saving code for later here;
    //login
    if (document.getElementById('login')) {
        document.getElementById('login').onclick = function(event) {
            event.preventDefault();
            var email = document.getElementById('email').value.trim();
            var password = document.getElementById('password').value.trim();

            var userCredentials = new Login(email, password);

            // var settings = {
            //   "async": true,
            //   "crossDomain": true,
            //   // TO-DO : add an absolute path ending in route...?
            //   "url": url()+"/login",
            //   "method": "POST",
            //   "dataType": "json",
            //   "headers": {
            //     "cache-control": "no-cache"
            //   },
            //   "data": JSON.stringify(userCredentials),
            //   "contentType": "application/json"
            // };
            //
            // $.ajax(settings).done(function(response) {
            //   console.log(response);
            //   window.location.href = "/select";
            // });
        };
    }

    // //Form validation (customer form)
    // function validateCustomer() {
    //     var firstName = document.getElementById('first-name').value.trim();
    //     var lastName = document.getElementById('last-name').value.trim();
    //     var phone = document.getElementById('phone').value.trim();
    //     var email = document.getElementById('email').value.trim();
    //     var streetaddress = document.getElementById('street-address').value.trim();
    //     var streetaddress2 = document.getElementById('street-address2').value.trim();
    //     var city = document.getElementById('city').value.trim();
    //     var state = document.getElementById('state').value.trim();
    //     var password = document.getElementById('password').value.trim();
    //     var zip = document.getElementById('zip').value.trim();

    //     if (firstName = "") {
    //       alert("Please fill in your first name");
    //     }
    //     if (lastName = "") {
    //       alert("Please fill in your last name");
    //     }
    //     if (phone = "") {
    //       alert("Please fill in your phone number");
    //     }
    //     if (email = "") {
    //       alert("Please fill in your email address");
    //     }
    //     if (streetaddress = "") {
    //       alert("Please fill in your street address");
    //     }
    //     if (city = "") {
    //       alert("Please fill in your city");
    //     }
    //     if (state = "") {
    //       alert("Please fill in your state");
    //     }
    //     if (password = "") {
    //       alert("Please fill in your password");
    //     }
    //     if (zip = "") {
    //       alert("Please fill in your zip");
    //     }
    // }

    // //Form validation (login form)
    // function validateLogin() {
    //     var email = document.getElementById('email').value.trim();
    //     var password = document.getElementById('password').value.trim();

    //     if (email = "") {
    //       alert("Please fill in your email address");
    //     }
    //     if (password = "") {
    //       alert("Please fill in your password");
    //     }
    // }

    // //Form validation (task form)
    // function validateTask() {
    //     var title = document.getElementById('title').value.trim();
    //     var description = document.getElementById('description').value.trim();
    //     var tools = document.getElementById('tools').value.trim();
    //     var timeframe = document.getElementById('timeframe').value.trim();
    //     var compensation = document.getElementById('compensation').value.trim();
    //     var payment_type = document.getElementById('payment_type').value.trim();

    //     if (title = "") {
    //     alert("Please fill in the title of your requested task");
    //     }
    //     if (description = "") {
    //     alert("Please fill in a detailed description of your task");
    //     }
    //     if (timeframe = "") {
    //     alert("Please fill in a time frame need to complete your task");
    //     }
    //     if (compensation = "") {
    //     alert("Please fill how you will compensate once your task has been completed");
    //     }
    //     if (payment_type = "") {
    //     alert("Please fill in the compensation payment type");
    //     }
    // }

});
