import React from "react";
import { v4 as uuidv4 } from "uuid";

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: "",
      topic: "",
      description: "",
      side1: "",
      side2: "",
      deadline: new Date(0),
      // resolution: "",
      arbitrator: this.props.signerAddress,
      commission: 0,
      minimumBet: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(k, evt) {
    this.setState({ [k]: evt.target.value });
  }

  handleSubmit(event){
    event.preventDefault();
    // console.log(this.deadline)
    // this.setState({deadline: Math.round(new Date(this.deadline).getTime()/1000)})
    const u_id = uuidv4();
    this.setState({ uuid: u_id }, () => this.props.addQuestion(this.state));
    alert("You have Submitted a new Topic!");
  }

  render() {
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
              type="date"
              onChange={(event) => this.handleChange("deadline", event)}
            />
          </label>
          {/* <label>
            Resolution:
            <input
              type="text"
              onChange={(event) => this.handleChange("resolution", event)}
            />
          </label> */}
          <label>
            Arbitrator:
            <br></br>
            <select name="Arbitrator" onChange={(event) => this.handleChange("arbitrator", event)} >
                <option value="Topic Creator">Topic Creator</option>
                <option value="Oracle">Oracle</option>
            </select>
          </label>
          <label>
            Commission (% of winnings):
            <input
              type="number"
              max="20"
              placeholder="must be below 20%"
              onChange={(event) => this.handleChange("commission", event)}
            />
          </label>
          <label>
            Minimum Bet (in Wei):
            <input
              type="number"
              min="100"
              placeholder="must be above 100"
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
        <MyForm className="table-cell" addQuestion={props.addQuestion} signerAddress={props.signerAddress}/>
      </div>
    </div>
  );
}

export default Add;
