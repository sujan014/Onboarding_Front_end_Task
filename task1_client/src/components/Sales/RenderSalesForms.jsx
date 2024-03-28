import NewSalesForm from "./NewSalesForm";
import EditSalesForm from "./EditSalesForm";
import DeleteSalesForm from "./DeleteSalesForm";

function RenderNewSalesForm(props){
    const {condition, formAction, updateChange} = props;

    if (condition){
        return <NewSalesForm callback={formAction} dataChange={updateChange}/>
    } else{
        return null;
    }
}

function RenderEditSalesForm(props){
    const {Id, condition, formAction, updateChange} = props;

    if (condition){
        return <EditSalesForm editid={Id} callback={formAction} dataChange={updateChange}/>
    } else{
        return null;
    }
}

function RenderDeleteSalesForm(props){
    const {Id, condition, formAction, updateChange} = props;

    if (condition){
        return <DeleteSalesForm deleteid={Id} callback={formAction} dataChange={updateChange}/>
    } else{
        return null;
    }
}

export {RenderNewSalesForm, RenderEditSalesForm, RenderDeleteSalesForm};