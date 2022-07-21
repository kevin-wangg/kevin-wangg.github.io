import React from 'react'
import styled from 'styled-components'

import Navbar from './Navbar'
import PageContainer from './PageContainer'

const SubHeading = styled.div`
    margin-top: 8%;
    font-size: 25px;
    color: grey;
`

const Text = styled.div`
    margin: 3% 0 0 0;
    line-height: 1.6;
`
const About = () => {
    return (
        <PageContainer>
            <Navbar />
            <SubHeading>
                Hi there, I'm Kevin!
            </SubHeading>
            <Text>
                I'm currently a computer science student at the University of Waterloo. I enjoy writing code and building things that can have an impact
                on my community.
            </Text>
            <Text>
                Outside of school, I enjoy being active and playing sports. I currently play badminton on the University of Waterloo Warrior's 
                Varsity badminton team. I also like to snowboard, rock climb, and I'm currently learning how to skateboard!
            </Text>
        </PageContainer>
    )
}

export default About