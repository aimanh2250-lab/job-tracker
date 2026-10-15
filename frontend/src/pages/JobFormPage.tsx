import { useParams } from "react-router";

export default function JobFormPage(){
    const {id} = useParams();
    const isEdit = id !== undefined; // !== is NOT
    return <h1 className="text-2xl font-bold p-8">{isEdit ? "Edit job" : "Add job"}</h1>
}
