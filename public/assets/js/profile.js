$(document).ready(function () {
    // Getting references to form data
    var firstName = $("#first-name");
    var lastName = $("#last-name");
    var phone = $("#phone");
    var email = $("#email");
    var streetAddress = $("#street-address");
    var streetAddress2 = $("#street-address2");
    var city = $("#city");
    var state = $("#state");
    var zip = $("#zip");
    var password = $("#password");

    // Get URL
    var getUrl = function() {
        var pathArray = location.href.split('/');
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + '//' + host;
        return url;
    };

    // A function for creating an user.
    function upsertUser(userData) {
        console.log(userData.city);
        $.post("/api/userprofile", userData, function() {
            window.location.href = "/select";
        });
    }


    // Adding event listeners to create a new form
    $("#profile-form").submit(function( event ) {
        // Stop form from submitting normally
        event.preventDefault();

        // Get values from elements from page
        upsertUser({
            firstame: firstName.val().trim(),
            lastname: lastName.val().trim(),
            phone: phone.val().trim(),
            email: email.val().trim(),
            streetaddress: streetAddress.val().trim(),
            streetaddress2: streetAddress2.val().trim(),
            city: city.val().trim(),
            state: state.val().trim(),
            zip: zip.val().trim(),
            password: password.val().trim()
        });
    });
});