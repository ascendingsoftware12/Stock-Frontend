import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import "../style/Login.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [Input, setInput] = useState({ username: "", password: "" });

  const onChangeValue = (e) => {
    setInput({ ...Input, [e.target.name]: e.target.value });
  };

  const loginSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      axios
        .post(`/auth/login`, {
          username: Input.username,
          password: Input.password,
        })
        .then((response) => {
          console.log(response.data["status"]);

          if (response.data.status == 1) {
            sessionStorage.setItem("token", response.data.token);
            console.log(response.data.token);
            // sessionStorage.setItem("asm", response.data.asm);
            if (response.data.role === "headoffice") {
              localStorage.setItem("showStateModal", "true");
              window.location.href = "#/ApproveTransfer";
              // window.location.reload();

              sessionStorage.setItem("flag", 1);
              sessionStorage.setItem("user", response.data.username);
            } else {
              if (response.data.role === "ASM") {
                sessionStorage.setItem("flag", 2);
                sessionStorage.setItem("asm", response.data.asm);

                sessionStorage.setItem("user", response.data.username);
                // sessionStorage.setItem("store", response.data.store);
                const asm = sessionStorage.getItem("asm");
                if (asm !== "null") {
                  window.location.href = "#/SalesAllinone";
                  window.location.reload();
                } else {
                  window.location.href = "#/TransferSummaryStore";
                  window.location.reload();
                }
              } else {
                if (response.data.role === "store") {
                  sessionStorage.setItem("flag", 3);
                  sessionStorage.setItem("store", response.data.store);
                  sessionStorage.setItem("user", response.data.username);
                  // sessionStorage.setItem("store", response.data.store);
                  const store = sessionStorage.getItem("store");
                  if (store !== "null") {
                    window.location.href = "#/AllinoneStockstore";
                    window.location.reload();
                  } else {
                    window.location.href = "#/TransferSummaryStore";
                    window.location.reload();
                  }
                }
              }
            }
          } else {
            Swal.fire({
              icon: "error",
              text: "Wrong password or username",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
    } catch (error) {
      // window.location.reload();
      console.error("Error fetching Login Data:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="contact-box">
        <div className="p-6 login-card bg-white">
          <form className="flex flex-col gap-4" onSubmit={loginSubmit}>
            {/* <img src={require("../images/Oppo-Logo.png")} alt="Description of image" /> */}
            <div>
              <Label htmlFor="email1" value="Username" />
              <TextInput
                name="username"
                id="username"
                type="text"
                required
                onChange={(e) => onChangeValue(e)}
              />
            </div>
            <div>
              <Label htmlFor="password1" value="Password" />
              <TextInput
                name="password"
                id="password"
                type="password"
                required
                onChange={(e) => onChangeValue(e)}
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button type="submit" className="button-submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
