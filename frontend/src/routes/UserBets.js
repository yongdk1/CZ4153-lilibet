import React, { useState} from "react";


function UserBets(props){

    const bets = props.userBets();
    console.log("USER BETS:", bets)

    return(
        <div className="parent-container">
            <h2 className="addHeader">
                List of Bets that you have placed:
            </h2>
        </div>
    )
}


export default UserBets;