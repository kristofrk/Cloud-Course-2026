export const handler = async (event) => {    
    // Assign the support case and update the status message    
    var myCaseID = event.Case;    
    var myMessage = event.Message + "assigned...";    
    var result = {Case: myCaseID, Message: myMessage};
    return result;     
};