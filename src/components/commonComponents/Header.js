import {Button, Header, Left, Right, Icon, Body, H3} from "native-base";
import React, {Component} from 'react';
import {Dimensions} from "react-native";
import {Actions} from 'react-native-router-flux';


export default class CustomHeader extends Component {

    render(){

        const styles = {
            header: {
                alignItems: 'center',
                elevation: 0,
                backgroundColor: '#6b3fef',
                alignSelf: 'stretch',
                borderBottomWidth: 5,
                borderBottomColor: '#6b3fef',
                flexDirection: 'row',
                width: '100%',
                height: 50
            },
            title: {
                color: '#FED95F',
                letterSpacing: 0.5,
                fontSize: 20,
                fontWeight: 'bold',

            }
        }


        return(
            <Header style={styles.header}>
                <Left style={{flex: 1}}>
                    {this.props.hamburger===true?
                        <Button transparent>
                            <Icon name="ios-menu" style={{color: '#FED95F'}}/>
                        </Button>:(this.props.back?<Button transparent>
                            <Icon name="ios-arrow-round-back" style={{color: '#FED95F'}}/>
                        </Button>:null)}

                </Left>
                <Body style={{flex: 3, alignItems: 'center'}}>
                {this.props.title?<H3 style={styles.title}>{this.props.title}</H3>:<H3 style={styles.title}>wearn</H3>}
                </Body>
                <Right style={{flex: 1}}>
                    <Button transparent>
                        <Icon name="md-notifications-outline" style={{color: '#FED95F'}}/>
                    </Button>
                </Right>
            </Header>
        );
    }
}