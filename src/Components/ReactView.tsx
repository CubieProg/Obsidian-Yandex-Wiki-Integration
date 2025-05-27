export const ReactView = () => {
  return <div>Hello, React!</div>;
};

const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];


export const ListReact = () => {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}


// import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export const MyClickableCard = () => {
  const handleClick = () => {
    // Handle the click event here
    console.log('Card clicked!');
    // alert.click("123");
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Clickable Card
          </Typography>
          <Typography variant="body2">
            This entire card is clickable.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyClickableCard;