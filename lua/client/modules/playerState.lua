ESX = exports['es_extended']:getSharedObject()

cache.player = {
    health = -1,
    armor = 0,
    voice = 25,
    isMale = false,
    isTalking = false
}
cache.player.ped = PlayerPedId()
cache.player.isMale = IsPedMale(cache.player.ped)
cache.player.clientId = PlayerId()
cache.player.serverId = GetPlayerServerId(cache.player.clientId)
local voiceModes = {}

local function mainThread()
    for i = 1, 3 do
        local dist = math.ceil(((i/3) * 100))
        voiceModes[i] = dist
    end

    Wait(3000)
    SendNUIMessage({
        action = 'updateWatermark',
        id = cache.player.serverId
    })

    local accounts = ESX.GetPlayerData().accounts
    local cash = 0
    if accounts then
        for _, v in pairs(accounts) do
            if v.name == 'money' then cash = v.money break end
        end
    end

    SendNUIMessage({
        action = 'updateWatermark',
        cash = cash
    })
end

local function updatePlayerPed()
    cache.player.ped = PlayerPedId()
    cache.player.isMale = IsPedMale(cache.player.ped)
    cache.player.clientId = PlayerId()
    cache.player.serverId = GetPlayerServerId(cache.player.clientId)
end

--@param key string @ key of data object to attach to data
--@param value string @ value for the key in the data object
local function updateHud(key, val)
    local data = {
        action = 'updateHud'
    }
    data[key] = val
    SendNUIMessage(data)
end

local function playerHudValuesThread()
    Wait(3000)
    while true do
        local health, armor = GetEntityHealth(PlayerPedId()), GetPedArmour(PlayerPedId())
        if (health ~= cache.player.health) then
            updateHud('health', (cache.player.isMale) and health - 100 or health)
            cache.player.health = health
        end

        if (armor ~= cache.player.armor) then
            updateHud('armor', armor)
            cache.player.armor = armor
        end

        local isTalking = MumbleIsPlayerTalking(cache.player.clientId)
        if (isTalking ~= cache.player.isTalking) then
            SendNUIMessage({
                action = 'updateIsTalking',
                isTalking = isTalking
            })
            cache.player.isTalking = isTalking
        end
        Wait(300)
    end
end

--@param newMode number @ the new talk mode from pma-voice
local function updatePlayerVoice(newMode)
    cache.player.voice = voiceModes[newMode]
    updateHud('voice', cache.player.voice)
    
    -- Show voice range indicator when voice mode changes
    SendNUIMessage({
        action = 'showVoiceRange',
        range = cache.player.voice
    })
end

--@param account table @ JSON Object from ESX
local function updatePlayerCash(account)
    if (account.name == 'money') then
        SendNUIMessage({
            action = 'updateWatermark',
            cash = account.money
        })
    end
end

CreateThread(mainThread)
RegisterNetEvent('esx:playerPedChanged', updatePlayerPed)
CreateThread(playerHudValuesThread)
AddEventHandler('pma-voice:setTalkingMode', updatePlayerVoice)
RegisterNetEvent('esx:setAccountMoney', updatePlayerCash)

-- Voice range key detection
CreateThread(function()
    while true do
        Wait(50) -- More responsive detection
        if IsControlJustPressed(0, 166) then -- F5 key
            -- Show current voice range when F5 is pressed
            if cache.player.voice then
                SendNUIMessage({
                    action = 'showVoiceRange',
                    range = cache.player.voice
                })
            end
        end
    end
end)