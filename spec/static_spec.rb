require 'spec_helper'

feature 'Static Pages' do
  scenario "resolves the homepage" do
    visit 'index.html'
    expect(page).to have_content 'flat'
  end
end
