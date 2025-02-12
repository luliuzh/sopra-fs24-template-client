import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        type={props.type || "text"}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

const Login = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState<string>(null);
  const [lastname, setLastname] = useState<string>(null);
  const [birthdate, setBirthdate] = useState<string>(null);
  const [gender, setGender] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ 
        firstname, 
        lastname, 
        birthdate, 
        gender 
      });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="First Name"
            value={firstname}
            onChange={(fn: string) => setFirstname(fn)}
          />
          <FormField
            label="Last Name"
            value={lastname}
            onChange={(ln: string) => setLastname(ln)}
          />
          <FormField
            label="Birthdate"
            value={birthdate}
            onChange={(bd: string) => setBirthdate(bd)}
            type="date"
          />
          <div className="login field">
            <label className="login label">Gender</label>
            <select 
              className="login input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender...</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div className="login button-container">
            <Button
              disabled={!firstname || !lastname || !birthdate || !gender}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
