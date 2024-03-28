import NewCustomerForm from "./NewCustomerForm";
import EditCustomerForm from "./EditCustomerForm";
import DeleteCustomerForm from "./DeleteCustomerForm";

function RenderNewCustomerForm(props){
    const {condition, formAction, updateChange} = props;
    if (condition){
        return <NewCustomerForm callback = {formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
    
}

function RenderEditCustomerForm(props){
    const {Id, condition, Name, Address, formAction, updateChange} = props;    
    if (condition){
        return <EditCustomerForm Id={Id} Name={Name} Address={Address} callback = {formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
}

function RenderDeleteCustomerForm(props){
    const {Id, condition, Name, Address, formAction, updateChange} = props;
    if (condition){
        return <DeleteCustomerForm Id={Id} Name={Name} Address={Address} callback = {formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }    
}

export {RenderNewCustomerForm, RenderEditCustomerForm, RenderDeleteCustomerForm};