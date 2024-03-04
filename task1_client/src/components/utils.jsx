import { Segment, Header } from "semantic-ui-react";

function ErrorComponent(props) {
    const text = props.text;
    return(
        <Segment>
            <Header as='h3'>
                {/* Render newline text like this */}
                {text.split('\n').map(str => <p>{str}</p>)}
            </Header>
        </Segment>
    );
}

export {ErrorComponent};