/*
 *    TODO:: Implement the edit and delete functionalities
 */

function Person(firstName, lastName, phone) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phone = phone;
}

window.addEventListener("load", loadEvent => {
  const list = document.getElementById("tableBody");
  const control = document.getElementsByClassName("controls")[0];

  const validatePerson = person => {
    // Add the following validation: all the fields should be mandatory
    const { firstName, lastName, phone } = person;

    const errorDiv = document.getElementById("error");
    if (errorDiv) errorDiv.remove();

    // Add the following validation: the First Name and the Last Name should have at least two characters
    let error = "";
    if (!firstName || firstName.length <= 2) {
      error +=
        "First name is mandatory and should be longer than 2 characters. ";
    }
    if (!lastName || lastName.length <= 2) {
      error +=
        "Last name is mandatory and should be longer than 2 characters. ";
    }
    // Add the following validation: the Phone Number should only contain digits
    if (!phone || !/[0-9]+/.test(phone)) {
      error += "Phone number is mandatory and should be numbers only. ";
    }

    const html = `<div id="error" style="display: inline-grid; color: red; size: 21px">${error}</div>`;
    if (error) {
      control.insertAdjacentHTML("beforeend", html);
      return false;
    }
    return true;
  };

  // Implement the addPerson() method that will add a new person to the phone agenda.
  const addPerson = person => {
    if (!validatePerson(person)) return;
    const { firstName, lastName, phone } = person;
    const html = `<tr>
          <td>${firstName}</td>
          <td>${lastName}</td>
          <td>${phone}</td>
      </tr>`;
    list.insertAdjacentHTML("beforeend", html);
  };

  // Call the addPerson() method when the user clicks the "Add Person" button.
  const submitButton = control.children[6];
  submitButton.addEventListener("click", clickEvent => {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const phone = document.getElementById("phone");
    addPerson(new Person(firstName.value, lastName.value, phone.value));
    // Clear the content of the text inputs after the user presses the "Add Person" button
    firstName.value = "";
    lastName.value = "";
    phone.value = "";
  });
});
