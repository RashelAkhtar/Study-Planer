import React, { useState } from 'react'
import SignUp from './SignUp&Login/SignUp'
import Login from './SignUp&Login/Login'
import "./styles/SignIn.css";

function SignIn({ onLoginSuccess }) {
    const [activeTab, setActiveTab] = useState("login");

  return (
    <div className='signin-container'>
        <div className='signin-card'>
            <div className='signin-tabs'>
                <button 
                 className={`tab-button ${activeTab === "login" ? "active" : ""}`}
                 onClick={() => setActiveTab("login")}
                >Login</button>

                <button
                className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => setActiveTab("signup")}
                >Sign Up</button>
            </div>

            <div className='signin-content'>
                {activeTab === "login" ? (
                    <Login onLoginSuccess={onLoginSuccess} />
                ) : (
                    <SignUp onSignUpSuccess={() => setActiveTab("login")} />
                )}
            </div>
        </div>
        
    </div>
  )
}

export default SignIn