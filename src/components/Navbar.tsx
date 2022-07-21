import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const LinkContainer = styled.div`
    display: flex;
    flex-direction: row;
`

const NavContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const Link = styled(NavLink)`
    margin: 20px;
    text-decoration: none;
    color: black;
`

const ExternalLink = styled.a`
    margin: 20px;
    text-decoration: none;
    color: black;
`
const Navbar = () => {

    return (
        <NavContainer>
            <h1>Kevin Wang</h1>
            <LinkContainer>
                <Link to='/'>
                    about
                </Link>
                <Link to='/experience'>
                    experience
                </Link>
                <ExternalLink href="/car/index.html" target="_blank">
                    vroom vroom
                </ExternalLink>
            </LinkContainer>
        </NavContainer>
    )
}
export default Navbar