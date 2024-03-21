import React from "react";
import {TableCell, TableRow, Button} from "semantic-ui-react";

function CustomerTableMap(props){
    const {customer, EditFormArgs, EditFormAction, DeleteFormAction} = props;

    const id = customer?.id ? customer?.id : 0;
    const name = customer?.name ? customer.name : "";
    const address = customer?.address ? customer.address : "";
    
    return(
        <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{address}</TableCell>
            <TableCell>
                <Button color="yellow" onClick={ () => EditFormArgs(id, name, address, EditFormAction) } icon="edit" labelPosition="left" content="Edit">                                        
                </Button>
            </TableCell>
            <TableCell>
                <Button color="red" onClick={ () => EditFormArgs(id, name, address, DeleteFormAction) } icon="trash" labelPosition="left" content="Delete">                                    
                </Button>
            </TableCell>
        </TableRow>
    )    
}

export default CustomerTableMap;

// function CustomerTableMap(props){
//     const {index, customer, editClick, deleteClick} = props;

//     const id = customer?.id ? customer?.id : 0;
//     const name = customer?.name ? customer.name : "";
//     const address = customer?.address ? customer.address : "";
//     //console.log(id+', '+name+', '+address);
//     return(
//         <TableRow>
//             <TableCell>{name}</TableCell>
//             <TableCell>{address}</TableCell>
//             <TableCell>
//                 <Button color="yellow" onClick={ editClick } icon="edit" labelPosition="left" content="Edit">                                        
//                 </Button>
//             </TableCell>
//             <TableCell>
//                 <Button color="red" onClick={ deleteClick } icon="trash" labelPosition="left" content="Delete">                                    
//                 </Button>
//             </TableCell>
//         </TableRow>
//     )    
// }