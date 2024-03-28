import React from "react";
import {TableCell, TableRow, Button} from "semantic-ui-react";

function StoreTableMap(props){
    const {store, EditFormArgs, EditFormAction, DeleteFormAction} = props;

    const id = store.id;
    const name = store?.name ? store.name : "";
    const address = store?.address ? store.address : "";
    
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

export default StoreTableMap;