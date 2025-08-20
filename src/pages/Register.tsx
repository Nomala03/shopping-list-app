import { useState } from "react";
import { hashPassword } from "../utils/encryption";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { registerUser } from "../features/auth/authSlices";


type RegisterForm = {
  email: string;
  password: string;
  name: string;
  surname: string;
  cellphone: string;
};

function Register() {
    const [form, setForm] = useState<RegisterForm>({
        name: "",
        surname: "",
        email: "",
        cellphone: "",
        password: "",
    });
   const dispatch = useDispatch<AppDispatch>();
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    const handleRegister = async (e: React. FormEvent) => {
        e.preventDefault();
        const hashed = await hashPassword(form.password);
        await dispatch(registerUser({ ...form, password: hashed}));
         // Redirect to login after successful registration
        };

    return (
        <div className= "flex item-center justify-center min-h-screen pt-24 pb-24 bg-gray-100 ">
            <form 
              onSubmit={handleRegister}
              className= "bg-white p-8 rounded-2xl shadow-lg h-130 w-96"
            >
                <h2 className= "text-xl mb-4 text-center">Register</h2>
                {(Object.keys(form)as (keyof RegisterForm)[]).map(field => (
                <input
                  key={field}
                  type= {field === "email" ? "email" : field === "password" ? "password" : "text"}
                  name= {field}
                  placeholder= {field.charAt(0).toUpperCase() + field.slice(1)}
                  value= {form[field]}       
                  className= "w-full p-2 mb-3 border border-gray-300 rounded-xl"
                  onChange= {handleChange}
                  required
                />
                ))}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-3 mt-6  rounded-xl" 
                  >
                    Register
                </button>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?
                    
                </p>
            </form>
        </div>
    );
}

export default Register;


