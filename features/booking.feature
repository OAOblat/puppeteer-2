Feature: Ticket Booking Functionality

  Scenario: Check availability of booking button for one available seat
    Given user is on the ticket booking page and selects an available session
    When user chooses one available seat for booking
    Then the booking button should be available

  Scenario: Check availability of booking button for two available seats
    Given user is on the ticket booking page and selects an available session
    When user chooses two available seats for booking
    Then the booking button should still be available

  Scenario: Check if disabled seat cannot be booked
    Given user is on the ticket booking page and selects an available session
    When user chooses a disabled seat for booking
    Then the booking button should be disabled