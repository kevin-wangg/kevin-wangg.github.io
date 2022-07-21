import React from 'react'
import styled from 'styled-components'
import Navbar from './Navbar'
import PageContainer from './PageContainer'

const SubHeading = styled.div`
    margin-top: 5%;
    font-size: 25px;
    color: grey;
`

const Text = styled.a`
    margin: 20px 0 0 0;
    font-size: 18px;
    line-height: 1.6;
    text-decoration: none;
    color: black;
`

const Experience = () => {
    return (
        <PageContainer>
            <Navbar />
            <SubHeading>
                Places I've worked at
            </SubHeading>
            <Text href='https://www.wealthsimple.com/en-ca'>
                → Wealthsimple
            </Text>
            <Text href='https://www.ncr.com'>
                → NCR Corporation
            </Text>
            <Text href='https://www.blackberry.com/us/en'>
                → Blackberry
            </Text>
        </PageContainer>
    )
}

export default Experience