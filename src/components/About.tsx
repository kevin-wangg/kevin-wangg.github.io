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
                Hi there, I'm Kevin! 👋
            </SubHeading>
            <Text>
                I'm a software engineer with interests in data engineering, backend development, and database systems. I am currently studying
                computer science at the University of Waterloo, with an expected graduation date of April 2024.
            </Text>
            <Text>
                Outside of school, I enjoy being active and playing sports. I'm also an avid badminton player, 
                having competed on the Canadian junior national team for four years. You can also find me rock climbing, snowboarding, and learning to skateboard! 
            </Text>
        </PageContainer>
    )
}

export default About