import { Segment, Header } from "semantic-ui-react";

function ErrorComponent(props) {
    const text = props.text;
    return(
        <Segment>
            <Header as='h3'>                
                {text}
            </Header>
        </Segment>
    );
}

export {ErrorComponent};