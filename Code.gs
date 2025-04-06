var spreadsheet = SpreadsheetApp.openById("1iAcOQvOMIsBP6YuiHhrOJGs5nGTuPKzDoa-6tGgrlWo"); // Get login spreadsheet
Logger.log(spreadsheet.getName());

let LoginSheet = spreadsheet.getSheetByName("login"); // Explicitly get the sheet by name
if (!LoginSheet) {
  Logger.log("Sheet not found!");
}
Logger.log(LoginSheet.getName());

function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  //return HtmlService.createHtmlOutputFromFile('index.html');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function LoginCheck(pEmail, pPassword) {
  let ReturnData = LoginSheet.getRange("A:A").createTextFinder(pEmail).matchEntireCell(true).findAll();
  let StartRow = 0;
  // Only selects one row for a pEmail, so we must enforce unique pEmails in the registration process (index.html)
  ReturnData.forEach(function (username) {
    StartRow = username.getRow();
  });

  let TmpPass = 0;
  if (StartRow > 0) {
    TmpPass = LoginSheet.getRange(StartRow, 2).getValue();
    if (TmpPass == pPassword) {
      return true;
    }
  }
  return false;
}

function RegistrationCheck(pEmail, pPassword) {
  var values = LoginSheet.getDataRange().getValues();

  // check if already exists in sheet
  for(let i = 0; i < values.length; i++) {
    console.log(values[i][0], values[i][1])
    console.log(pEmail, pPassword)
    if(values[i][0] == pEmail && values[i][1] == pPassword) {
      return "User already exists";
    } 
    else if(values[i][0] == pEmail) {
      return "Email already being used";
    }
  }
  
  return "New User"
  
  // Append new user's email and password to the login sheet (may need to be updated to check whether the email is in org's records as a paying member)
  //LoginSheet.appendRow([pEmail, pPassword]);
  //return "Registration successful";
  
}

function AddUser(pEmail, pPassword) {
  // Append new user's email and password to the login sheet (may need to be updated to check whether the email is in org's records as a paying member)
  LoginSheet.appendRow([pEmail, pPassword]);
  
  return "Registration successful";
}

function UpdateUser(infoArray) {
  var values = LoginSheet.getDataRange().getValues();

  // find current user in sheet
  for(let i = 0; i < values.length; i++) {
    if(values[i][0] == infoArray.email && values[i][1] == infoArray.password) {
      // Change from append to UPSERT on this row
      LoginSheet.appendRow([infoArray.email, infoArray.password, infoArray.firstName, infoArray.lastName, infoArray.houseName, infoArray.suburbName]);
      LoginSheet.deleteRow(i);
      return "Update successful";
    }
  }
  
}

function OpenPage(PageName) {
  return HtmlService.createHtmlOutputFromFile(PageName).getContent();
}

function saveValue(key, value) {
    PropertiesService.getScriptProperties().setProperty(key, value);
}
function getValue(key) {
    var value = PropertiesService.getScriptProperties().getProperty(key);
    Logger.log("getValue: " + key + " = " + value);
    return value;
}

function debugGetAllProperties() {
    var properties = PropertiesService.getScriptProperties().getProperties();
    Logger.log(properties);
    return properties;
}
