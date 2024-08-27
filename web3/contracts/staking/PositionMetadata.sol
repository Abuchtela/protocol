// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// OZ imports
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "hardhat/console.sol";

// Internal imports
import { StakingPool, Position } from "./data.sol";

contract PositionMetadata {
    using Strings for uint256;
    using Strings for address;

    function metadataBytes(
        uint256 positionTokenID,
        Position memory position,
        StakingPool memory pool
    ) public view returns (bytes memory) {
        // encode the image
        string memory image = Base64.encode(bytes(generateSVG(position, pool)));
        bytes memory result = bytes(
            abi.encodePacked(
            '{"token_id":"',
            Strings.toString(positionTokenID),
            '","image": "',
            'data:image/svg+xml;base64,',
            image,
            ',"result_version":1,"attributes": ['
        )
        );

        result = abi.encodePacked(result, '{"trait_type":"Pool ID","value":"', Strings.toString(position.poolID), '"}');

        result = abi.encodePacked(
            result,
            ",",
            pool.tokenType == 721
                ? '{"trait_type":"Staked token ID","value":"'
                : '{"trait_type":"Staked amount","value":"',
            Strings.toString(position.amountOrTokenID),
            '"}'
        );

        result = abi.encodePacked(
            result,
            ',{"display_type":"number","trait_type":"Staked at","value":',
            Strings.toString(position.stakeTimestamp),
            "}"
        );

        result = abi.encodePacked(
            result,
            ',{"display_type":"number","trait_type":"Lockup expires at","value":',
            Strings.toString(position.stakeTimestamp + pool.lockupSeconds),
            "}"
        );

        result = abi.encodePacked(result, "]}");

        return result;
    }

    /// @notice Returns a JSON string representing a position's on-chain metadata.
    function metadataJSON(
        uint256 positionTokenID,
        Position memory position,
        StakingPool memory pool
    ) public view returns (string memory) {
        return string(metadataBytes(positionTokenID, position, pool));
    }

    function metadata(
        uint256 positionTokenID,
        Position memory position,
        StakingPool memory pool
    ) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(metadataBytes(positionTokenID, position, pool))
                )
            );
    }

     // Add positionParams in the future
    function generateSVG(
        Position memory position,
        StakingPool memory pool
    ) internal view returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                generateSVGForeground(position, pool)
            )
        );
    }

    function generateSVGForeground(
        Position memory position,
        StakingPool memory pool
    ) private view returns (string memory svg) {
        string memory tokenAmountOrIdString = pool.tokenType == 721 ? "Token ID" : "Amount staked";
        string memory poolAdminString = Strings.toHexString(uint256(uint160(pool.administrator)), 20);
        string memory amountOrTokenIDString = (position.amountOrTokenID).toString();
        string memory stakeTimestampStr = (position.stakeTimestamp).toString();
        string memory unlockTimestampStr = (position.unstakeInitiatedAt + pool.lockupSeconds).toString();
        string memory cooldownStr = (pool.cooldownSeconds).toString();
        string memory poolIdString = (position.poolID).toString();
        string memory tokenTypeString = pool.tokenType == 1
            ? "Native"
            : pool.tokenType == 20
                ? "ERC20"
                : pool.tokenType == 721
                    ? "ERC721"
                    : "ERC1155";

        string memory tokenSymbol = pool.tokenType == 1 ? returnTokenSymbolNative() : returnTokenSymbol(pool.tokenType, pool.tokenAddress);

        svg = string(
            abi.encodePacked(
                '<svg width="1840" height="1920" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
                // "<style>",
                // "@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900&amp;1,14..32,100..900&amp;display=swap');",
                // "text { font-family: 'Inter'; }",
                // "</style>",
                '<g filter="url(#filter0_d_1689_1102)">',
                '<g clip-path="url(#clip1_1689_1102)">',
                '<rect x="120" y="80" width="1760" height="1840" rx="80" fill="#292929"/>',
                '<rect x="120" y="80" width="1760" height="1840" rx="80" fill="url(#pattern0_1689_1102)" fill-opacity="0.8"/>',
                '<rect x="120" y="80" width="1756" height="1840" fill="url(#paint1_linear_1689_1102)"/>',
                '<g style="mix-blend-mode:overlay">',
                '<rect x="120" y="1920" width="1840" height="1756" transform="rotate(-90 120 1920)" fill="url(#paint2_linear_1689_1102)" fill-opacity="0.8"/>',
                "</g>",
                '<g filter="url(#filter1_d_1689_1102)">',
                '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="220" font-weight="800" letter-spacing="-0.04em"><tspan x="340.124" y="583.682">', tokenSymbol ,'</tspan></text>',
                '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="220" letter-spacing="-0.04em"><tspan x="220" y="583.682">$</tspan></text>',
                generateAdminElement(poolAdminString),
                "</g>",
                '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="58.7383" font-weight="800" letter-spacing="0.01em"><tspan x="220" y="1756.22">FORK THE WORLD.</tspan></text>',
                '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="58.7383" font-weight="800" letter-spacing="0.01em"><tspan x="220" y="1811.22">OWN THE FUTURE.</tspan></text>',
                '<rect x="1668.77" y="1705.77" width="107.459" height="107.459" rx="53.7295" stroke="#CBCFCB" stroke-width="7.54098"/>',
                '<path d="M1693.75 1741.59L1705.21 1759.03H1720.05L1716.68 1753.9H1727.38L1714.61 1773.35L1722.03 1784.64L1750.31 1741.59H1693.75Z" fill="#CBCFCB"/>',
                '<path d="M1693.75 1741.59L1705.21 1759.03H1720.05L1716.68 1753.9H1727.38L1714.61 1773.35L1722.03 1784.64L1750.31 1741.59H1693.75Z" fill="#CBCFCB"/>',
                generateTokenAddressElement(poolAdminString),
                '<rect x="221" y="998" width="1558" height="190" rx="19" fill="#18181B" fill-opacity="0.8"/>',
                '<rect x="221" y="998" width="1558" height="190" rx="19" stroke="#737373" stroke-width="2"/>',
                generateTokenIdOrAmountElement(tokenAmountOrIdString),
                '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="80" font-weight="bold" letter-spacing="0em"><tspan x="260" y="1157.18">',
                amountOrTokenIDString,
                "</tspan></text>",
                '<text fill="#7E807E" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="32" letter-spacing="0em"><tspan x="220" y="1266.14">Staked at</tspan></text>',
                '<rect x="221" y="1295" width="502" height="86" rx="19" fill="#18181B" fill-opacity="0.8"/>',
                '<rect x="221" y="1295" width="502" height="86" rx="19" stroke="#737373" stroke-width="2"/>',
                '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="40" letter-spacing="0em"><tspan x="260" y="1352.55">',
                stakeTimestampStr,
                "</tspan></text>",
                '<text fill="#7E807E" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="32" letter-spacing="0em"><tspan x="748" y="1266.14">Unlocks at</tspan></text>',
                '<rect x="749" y="1295" width="502" height="86" rx="19" fill="#18181B" fill-opacity="0.8"/>',
                '<rect x="749" y="1295" width="502" height="86" rx="19" stroke="#737373" stroke-width="2"/>',
                '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="40" letter-spacing="0em"><tspan x="788" y="1352.55">',
                unlockTimestampStr,
                "</tspan></text>",
                '<text fill="#7E807E" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="32" letter-spacing="0em"><tspan x="1276" y="1266.14">Cooldown</tspan></text>',
                '<rect x="1277" y="1295" width="502" height="86" rx="19" fill="#18181B" fill-opacity="0.8"/>',
                '<rect x="1277" y="1295" width="502" height="86" rx="19" stroke="#737373" stroke-width="2"/>',
                '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="40" letter-spacing="0em"><tspan x="1316" y="1352.55">Initiated at ',
                cooldownStr,
                "</tspan></text>",
                '<rect x="221" y="1429" width="1558" height="113" rx="19" fill="#18181B" fill-opacity="0.8"/>',
                '<rect x="221" y="1429" width="1558" height="113" rx="19" stroke="#737373" stroke-width="2"/>',
                generateTokenTypeElement(tokenTypeString, poolIdString),
                "</g>",
                '<rect x="122" y="82" width="1756" height="1836" rx="78" stroke="url(#paint3_linear_1689_1102)" stroke-width="4"/>',
                "</g>",
                "</svg>"
            )
        );
    }

    function generateAdminElement(string memory poolAdminString) public pure returns (string memory) {
        uint256 averageCharWidth = 17;
        uint256 horizontalPadding = 20;
        uint256 borderPadding = 96;

        // calculate correct rect width from text width and find center of text
        uint256 textWidth = bytes(poolAdminString).length * averageCharWidth;
        uint256 rectWidth = textWidth + horizontalPadding;
        uint256 xPos = 1840 - rectWidth - borderPadding;
        uint256 textY = 181 + (48 / 2) + (28 / 2) - 4;

        // Build SVG string with minimal variables
        return
            string(
                abi.encodePacked(
                    '<rect x="',xPos.toString(),'" y="181" width="',
                    rectWidth.toString(),
                    '" height="48" rx="21" fill="#FFEFB8" fill-opacity="0.4"/>',
                    '<rect x="',
                    xPos.toString(),
                    '" y="181" width="',
                    rectWidth.toString(),
                    '" height="48" rx="21" stroke="#737373" stroke-width="2"/>',
                    '<text x="',
                    (xPos + horizontalPadding + 10).toString(),
                    '" y="',
                    textY.toString(),
                    '" fill="#FFEFB8" font-family="Noto Sans" font-size="28" font-weight="bold">',
                    poolAdminString,
                    "</text>"
                )
            );
    }

    // very basic looking, may improve upon in the future
    function generateTokenAddressElement(string memory tokenAddress) public pure returns (string memory) {
        string memory fontFamily = 'Noto Sans';
        return
            string(
                abi.encodePacked(
                    '<rect x="221" y="873" width="1558" height="77" rx="19" fill="#CBCFCB" fill-opacity="0.2"/>',
                    '<rect x="221" y="873" width="1558" height="77" rx="19" stroke="#737373" stroke-width="2"/>',
                    '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="',fontFamily,'" font-size="32" font-weight="500" letter-spacing="0em"><tspan x="250" y="923.136">Token Address</tspan></text>',
                    '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="',fontFamily,'" font-size="32" letter-spacing="0em"><tspan x="980" y="923.136">',
                    tokenAddress,
                    "</tspan></text>"
                )
            );
    }

    function generateTokenIdOrAmountElement(string memory tokenIdOrAmountString) public pure returns (string memory) {
        string memory fontFamily = 'Noto Sans';
        uint256 averageCharWidth = 18;
        uint256 horizontalPadding = 20;

        // calculate correct rect width from text width and find center of text
        uint256 textWidth = bytes(tokenIdOrAmountString).length * averageCharWidth;
        uint256 rectWidth = textWidth + (horizontalPadding * 2);

        return (
            string(
                abi.encodePacked(
                    '<rect x="241" y="1018" width="', (rectWidth - horizontalPadding).toString() ,'" height="48" rx="21" stroke="#737373" stroke-width="2"/>',
                    '<text x="260" y="1052.18" fill="#7E807E" xml:space="preserve" style="white-space: pre" font-family="', fontFamily, '"  font-size="28" font-weight="bold" letter-spacing="0em">',
                    tokenIdOrAmountString,
                    "</text>"
                )
            )      
        );
    }

    function generateTokenTypeElement(string memory tokenTypeString, string memory poolIdString) public pure returns (string memory) {
        string memory fontFamily = 'Noto Sans';
        uint256 averageCharWidth = 18;
        uint256 horizontalPadding = 20;
        // calculate correct rect width from text width and find center of text
        uint256 textWidth = bytes(tokenTypeString).length * averageCharWidth;
        uint256 rectWidth = textWidth + horizontalPadding;
        return
            string(
                abi.encodePacked(
                    '<rect x="241" y="1461.5" width="', rectWidth.toString(),'" height="48" rx="21" fill="#FFEFB8" fill-opacity="0.4"/>',
                    '<text x="260" y="1495.68" fill="#FFEFB8" font-family="',fontFamily,'" font-size="28" font-weight="bold">', tokenTypeString, '</text>',
                    '<text fill="#CBCFCB" xml:space="preserve" style="white-space: pre" font-family="',fontFamily,'" font-size="32" letter-spacing="0em"><tspan x="388" y="1495.68">',
                    poolIdString,
                    "</tspan></text>"
                )
            );
    }

    function returnTokenSymbolNative() public view returns (string memory) {
        uint256 chainId = block.chainid;
        // Ethereum mainnet or arbitrum sepolia
        if (chainId == 1 || chainId == 421614) return "ETH";
        else if (chainId == 13746) return "G7";
        else return "N/A";
    }

    function returnTokenSymbol(uint256 tokenType, address tokenAddress) public view returns (string memory) {
        if (tokenType == 20) return ERC20(tokenAddress).symbol();
        else if (tokenType == 721) return ERC721(tokenAddress).symbol();
        else return "N/A";
    }

    
}
