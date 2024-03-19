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
    const {condition, Id, Name, Address, formAction, updateChange} = props;

    if (condition){
        return <EditStoreForm Id={Id} Name={Name} Address={Address} callback = {formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
}

function RenderDeleteStoreForm(props){
    const {condition, Id, Name, Address, formAction, updateChange} = props;

    if (condition){
        return <DeleteStoreForm Id={Id} Name={Name} Address={Address} callback={formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
}

{/* {newstoreform ? <NewStoreForm callback={NewStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
{editstoreform ? <EditStoreForm Id={argid} Name={argname} Address={argaddress} callback = {EditStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
{deletestoreform ? <DeleteStoreForm Id={argid} Name={argname} Address={argaddress} callback={DeleteStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null} */}

export {RenderNewStoreForm, RenderEditStoreForm, RenderDeleteStoreForm};