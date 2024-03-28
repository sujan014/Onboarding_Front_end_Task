import NewProductForm from "./NewProductForm";
import EditProductForm from "./EditProductForm";
import DeleteProductForm from "./DeleteProductForm";

function RenderNewProductForm(props){
    const {condition, formAction, updateChange} = props;
    if (condition){
        return <NewProductForm callback = {formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
    
}

function RenderEditProductForm(props){
    const {Id, condition, Name, Price, formAction, updateChange} = props;
    if (condition){
        return <EditProductForm Id={Id} Name={Name} Price={Price} callback = {formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }
}

function RenderDeleteProductForm(props){
    const {Id, condition, Name, Price, formAction, updateChange} = props;
    if (condition){
        return <DeleteProductForm Id={Id} Name={Name} Price={Price} callback = {formAction} dataChange={updateChange}/>
    }
    else{
        return null;
    }    
}

export {RenderNewProductForm, RenderEditProductForm, RenderDeleteProductForm};