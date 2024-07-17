import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js"; 

import { apiResponse } from "../utils/apiResponse.js";

const createMessage = asyncHandler(async (req, res) => {
   
});

const getMessages = asyncHandler(async (req, res) => {

});



export {
    createMessage,
    getMessages,
};

