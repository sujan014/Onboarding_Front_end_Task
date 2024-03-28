import React from "react";
import {TableCell, TableRow, Button} from "semantic-ui-react";

function SalesTableMap(props){
    const {id, product, customer, store, date, EditFormArgs, EditFormAction, DeleteFormAction} = props;

    return(
        <TableRow>
            <TableCell>{product}</TableCell>
            <TableCell>{customer}</TableCell>
            <TableCell>{store}</TableCell>
            <TableCell>{date}</TableCell>
            <TableCell>
                <Button 
                    color='yellow' 
                    onClick={ () => {EditFormArgs(id, EditFormAction)} } 
                    icon='edit' 
                    labelPosition="left" 
                    content='Edit' >
                </Button>
            </TableCell>
            <TableCell>
                <Button 
                    color='red' 
                    onClick={ () => {EditFormArgs(id, DeleteFormAction)} } 
                    icon='trash' 
                    labelPosition="left" 
                    content='Delete' >
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default SalesTableMap;