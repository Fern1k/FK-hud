local ESX = exports["es_extended"]:getSharedObject()
cache = {}
local client = {}

client.setupScript = function()
    Wait(1000)
    SendNUIMessage({
        action = 'setupHud'
    })
end

RegisterNetEvent('esx:playerLoaded', client.setupScript)
CreateThread(client.setupScript)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000) -- co sekundę

        local playerPed = PlayerPedId()
        local health = GetEntityHealth(playerPed) - 100
        local armor = GetPedArmour(playerPed)

        TriggerEvent('esx_status:getStatus', 'hunger', function(hunger)
            TriggerEvent('esx_status:getStatus', 'thirst', function(thirst)
                local hungerPercent = math.floor((hunger.val / 1000000) * 100)
                local thirstPercent = math.floor((thirst.val / 1000000) * 100)

                SendNUIMessage({
                    action = 'updateHud',
                    health = health,
                    armor = armor,
                    hunger = hungerPercent,
                    thirst = thirstPercent
                })
            end)
        end)
    end
end)