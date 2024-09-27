import { useState } from "react";

function useForm (initObj){
  const [form, setForm] = useState(initObj);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  return [form, handleChange];
}

export default useForm;
