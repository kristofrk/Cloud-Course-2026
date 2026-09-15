export const handler = async (event) => {    
    // Escalate the support case 
    var myCaseID = event.Case;    
    var myCaseStatus = event.Status;    
    var myMessage = event.Message + "escalating.";    
    var result = {Case: myCaseID, Status : myCaseStatus, Message: myMessage};
    return result;
};