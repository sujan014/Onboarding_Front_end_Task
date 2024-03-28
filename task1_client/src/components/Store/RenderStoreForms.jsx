import NewStoreForm from "./NewStoreForm";
import EditStoreForm from "./EditStoreForm";
import DeleteStoreForm from "./DeleteStoreForm";

function RenderNewStoreForm(props){
    const {condition, formAction, updateChange} = props;

    if (condition){
        return <NewStoreForm callback={formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
}

function RenderEditStoreForm(props){
    const {Id, condition, Name, Address, formAction, updateChange} = props;

    if (condition){
        return <EditStoreForm Id={Id} Name={Name} Address={Address} callback = {formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
}

function RenderDeleteStoreForm(props){
    const {Id, condition, Name, Address, formAction, updateChange} = props;

    if (condition){
        return <DeleteStoreForm Id={Id} Name={Name} Address={Address} callback={formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
}

export {RenderNewStoreForm, RenderEditStoreForm, RenderDeleteStoreForm};