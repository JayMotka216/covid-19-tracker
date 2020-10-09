import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core'
import '../css/infobox.css'

function InfoBox({ title, cases, total, ...props }) {
    return(
        <Card className={`infoBox ${props.active && props.type ==="1" && 'infoBox--red'} ${props.active && props.type === "2" && 'infoBox--green'} ${props.active && props.type === "3" && 'infoBox--blue'} `} 
            onClick={props.onClick}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                <h2 className={`infoBox__cases ${props.type ==="1" && 'infoBox--red_cases'} ${props.type === "2" && 'infoBox--green_cases'} ${props.type === "3" && 'infoBox--blue_cases'}`}>{cases}</h2>

                <Typography className="infoBox__total"> {total} Total </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;