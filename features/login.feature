Feature: Login
  As a shopper
  I want to log in to Swag Labs
  So that I can buy products

  Background:
    Given I am on the login page

  @smoke
  Scenario: Successful login
    When I log in with username "standard_user" and password "secret_sauce"
    Then I should see the products page

  @regression
  Scenario Outline: Login fails with invalid credentials
    When I log in with username "<username>" and password "<password>"
    Then I should see the error "<error>"

    Examples:
      | username        | password     | error                                                                     |
      | locked_out_user | secret_sauce | Epic sadface: Sorry, this user has been locked out.                       |
      | standard_user   | wrong        | Epic sadface: Username and password do not match any user in this service |
      |                 | secret_sauce | Epic sadface: Username is required                                        |
      | standard_user   |              | Epic sadface: Password is required                                        |