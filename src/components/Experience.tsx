import React from 'react'
import useCollapse from 'react-collapsed'

import styled from 'styled-components'
import Navbar from './Navbar'
import PageContainer from './PageContainer'

const SubHeading = styled.div`
    margin-top: 5%;
    font-size: 25px;
    color: grey;
`

const Text = styled.a`
    margin: 5px 0 0 0;
    font-size: 1rem;
    line-height: 1.6;
    text-decoration: none;
    color: black;
`

const WorkName = styled.div`
    margin: 20px 0 0 0;
    font-size: 1.3rem;
    line-height: 1.6;
    text-decoration: none;
    color: #379683;
    transition: all 200ms ease-out;
    cursor: pointer;

    &:hover {
        font-size: 1.4rem;
    }

`

const Experience = () => {
    const { getCollapseProps: getWSCollapseProps, getToggleProps: getWSToggleProps } = useCollapse()
    const { getCollapseProps: getNCRCollapseProps, getToggleProps: getNCRToggleProps } = useCollapse()
    const { getCollapseProps: getBBCollapseProps, getToggleProps: getBBToggleProps } = useCollapse()

    return (
        <PageContainer>
            <Navbar />
            <SubHeading>
                Places I've worked at
            </SubHeading>
            <WorkName {...getWSToggleProps()}>
                Wealthsimple
            </WorkName>
            <Text {...getWSCollapseProps()}>
                Helped build the world's most human financial company using
                Ruby on Rails, Python, and Apache Airflow
            </Text>

            <WorkName {...getNCRToggleProps()}>
                NCR
            </WorkName>
            <Text {...getNCRCollapseProps()}>
                Built backend APIs for ATM transaction flows using Java and Spring
            </Text>

            <WorkName {...getBBToggleProps()}>
                Blackberry
            </WorkName>
            <Text {...getBBCollapseProps()}>
                Developed endpoints for mock threat classification server using Node.js, Express.js and SQLite
            </Text>
        </PageContainer>
    )
}

export default Experience