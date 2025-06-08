import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

export default function Navi() {
    return (
        <>
            <NavLink className="nav-link" to="/">Home</NavLink>  
            <NavLink className="nav-link" to="/resume">Resume</NavLink>    
         </>
    )
}