import asyncio
import aiohttp
async def deploy():
    async with aiohttp.ClientSession() as session:
        async with session.post('http://80.87.110.190/api/v1/deployNFT', json={"address":"EQAf2_d83qovZQqTY--LW20NBONhzU-D7ItYdXC8td1k520r","content":{"name":"Citizen","description":"Citizen","image":"https://arweave.net/9xf_L3YUKvg6e93EnXeOMQNF9kZt-ylh7hCVjSedG78?ext=png","content_url":"https://arweave.net/tyOiQCVaa63urscZEtuZsE3L4zQfAkfzOowY7CsdDhs?ext=html","attributes":[]}}) as resp:
            response = await resp.read()
            print(response)



async def edit():
    async with aiohttp.ClientSession() as session:
        async with session.post('http://80.87.110.190/api/v1/deployNFT', json={"address":"EQAf2_d83qovZQqTY--LW20NBONhzU-D7ItYdXC8td1k520r","content":{"name":"Citizen","description":"Citizen","image":"https://arweave.net/9xf_L3YUKvg6e93EnXeOMQNF9kZt-ylh7hCVjSedG78?ext=png","content_url":"https://arweave.net/tyOiQCVaa63urscZEtuZsE3L4zQfAkfzOowY7CsdDhs?ext=html","attributes":[]}}) as resp:
            response = await resp.read()
            print(response)


