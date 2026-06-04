import React from "react";
import { useState } from "react";
import { Image1 } from "../../../assets/images/Myimg";

const Achievement = () => {
  const [category, setCategory] = useState();

  const courses = [
    {
      id: 1,
      img: Image1,

    }
  ]
  return (
    <div className="courses">
      <button onClick={()=>setCategory("All")}>All</button>
      <button onClick={()=>setCategory("Coding")}>Coding</button>
      <button onClick={()=>setCategory("Programing")}>Programing</button>
    </div>
  );
};
export default Achievement;
