import React from "react";
import { v4 as uuidv4 } from "uuid";

export class MyForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uuid: "",
      topic: props.topic,
      description: props.description,
      side1: props.side1,
      side2: props.side2,
      deadline: props.deadline,
      resolution: props.resolution,
      commission: props.commission,
      minimumBet: props.minimumBet,
      arbitrator: props.arbitrator,
      show: true,
      winner: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.createUUID = this.createUUID.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(k, evt) {
    this.setState({ [k]: evt.target.value });
  }

  createUUID() {
    const u_id = uuidv4();
  }

  // to add adding to blockchain functionality
  handleSubmit(event) {
    event.preventDefault();
    const u_id = uuidv4();
    this.setState({ uuid: u_id }, () => this.props.addQuestion(this.state));
    alert("You have Submitted a new Topic!");
  }

  render() {
    // console.log("UUID:", this.state.uuid);
    return (
      <div>
        <form className="form" onSubmit={this.handleSubmit}>
          <label>
            Topic:
            <input
              type="text"
              onChange={(event) => this.handleChange("topic", event)}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              onChange={(event) => this.handleChange("description", event)}
            />
          </label>
          <label>
            Side 1:
            <input
              type="text"
              onChange={(event) => this.handleChange("side1", event)}
            />
          </label>
          <label>
            Side 2:
            <input
              type="text"
              onChange={(event) => this.handleChange("side2", event)}
            />
          </label>
          <label>
            Deadline to place bets:
            <input
              type="text"
              onChange={(event) => this.handleChange("deadline", event)}
            />
          </label>
          <label>
            Resolution:
            <input
              type="text"
              onChange={(event) => this.handleChange("resolution", event)}
            />
          </label>
          <label>
            Arbitrator:
            <input
              type="text"
              onChange={(event) => this.handleChange("arbitrator", event)}
            />
          </label>
          <label>
            Commission for contract creator:
            <input
              type="text"
              onChange={(event) => this.handleChange("commission", event)}
            />
          </label>
          <label>
            Minimum Bet:
            <input
              type="text"
              onChange={(event) => this.handleChange("minimumBet", event)}
            />
          </label>
          <button type="submit" className="btn btn-primary mb-2">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

function Add(props) {
  console.log("Questions on ADD:", props.questionList);
  return (
    <div className="parent-container">
      <h2 className="addHeader">Add A Topic</h2>
      <div className="splitScreen">
        <div className="table-cell">
          <h4>General Info:</h4>
          <p>Your address:</p>
          <p>Your info:</p>
          <p>Contract Owner:</p>
          <p>Number of Questions:</p>
          <p>Block Number:</p>
        </div>
        <MyForm className="table-cell" addQuestion={props.addQuestion} />
      </div>
    </div>
  );
}

export default Add;
