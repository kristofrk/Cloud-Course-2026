export const handler = async (event) => { 
    // Close the support case    
    var myCaseStatus = event.Status;    
    var myCaseID = event.Case;    
    var myMessage = event.Message + "closed.";    
    var result = {Case: myCaseID, Status : myCaseStatus, Message: myMessage};
    return result;
};